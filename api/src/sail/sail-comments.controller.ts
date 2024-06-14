import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Queue } from 'bull';
import { CommentEntity } from '../comment/comment.entity';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { ProfileRole } from '../types/profile/profile-role';
import { SailNewCommentJob } from '../types/sail/sail-new-comment-job';
import { JwtObject } from '../types/token/jwt-object';
import { UserAccessFields } from '../types/user-access/user-access-fields';
import { User } from '../user/user.decorator';
import { SailEntity } from './sail.entity';
import { SailService } from './sail.service';
import { DeleteResult } from 'typeorm';

@Controller('sail')
@ApiTags('sail')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class SailCommentsController {

  constructor(
    private sailService: SailService,
    @InjectQueue('sail') private readonly sailQueue: Queue,
  ) { }

  @Post('/:id/comments')
  async postComment(@User() user: JwtObject, @Param('id') id: string, @Body() commentInfo: Partial<Comment>) {
    const comment = CommentEntity.create(commentInfo);

    comment.author_id = user.profile_id;
    comment.created_at = new Date();
    comment.commentable_id = id;
    comment.commentable_type = SailEntity.name;

    const savedComment = await comment.save();

    const job: SailNewCommentJob = {
      sail_id: id,
      comment_id: savedComment.id,
    };
    this.sailQueue.add('new-comment', job, { jobId: `comment_${savedComment.id}` });

    return this.sailService.getFullyResolvedSail(id);
  }

  @Delete('/:id/comments/:commentId')
  async deleteComment(@User() user: JwtObject, @Param('id') id: string, @Param('commentId') commentId: string) {
    let result: DeleteResult;
    if (
      user.roles.includes(ProfileRole.Admin) ||
      user.access[UserAccessFields.CreateSail] ||
      user.access[UserAccessFields.EditSail]
    ) {
      result = await CommentEntity.delete(commentId);
    } else {
      result = await CommentEntity.delete({
        author_id: user.profile_id,
        commentable_id: id,
        id: commentId,
      });
    }

    if (result?.affected > 0) {
      this.sailQueue.removeJobs(`comment_${commentId}`);
    }

    return this.sailService.getFullyResolvedSail(id);
  }
}
