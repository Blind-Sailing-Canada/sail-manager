import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  Controller,   Delete,   Param, Post, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Queue } from 'bull';
import { CommentEntity } from '../comment/comment.entity';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { ProfileRole } from '../types/profile/profile-role';
import { SocialNewCommentJob } from '../types/social/social-new-comment-job';
import { JwtObject } from '../types/token/jwt-object';
import { UserAccessFields } from '../types/user-access/user-access-fields';
import { User } from '../user/user.decorator';
import { SocialEntity } from './social.entity';

@Controller('social')
@ApiTags('social')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class SocialCommentsController {

  constructor(@InjectQueue('social') private readonly socialQueue: Queue) { }

  @Post('/:id/comments')
  async postComment(@User() user: JwtObject, @Param('id') id: string, @Body() commentInfo: Partial<Comment>) {
    const comment = CommentEntity.create(commentInfo);

    comment.author_id = user.profile_id;
    comment.created_at = new Date();
    comment.commentable_id = id;
    comment.commentable_type = SocialEntity.name;

    const savedComment = await comment.save();

    const job: SocialNewCommentJob = {
      social_id: id,
      comment_id: savedComment.id,
    };
    this.socialQueue.add('new-comment', job);

    return SocialEntity.findOne( {
      where: { id },
      relations: ['manifest'],
    });
  }

  @Delete('/:id/comments/:commentId')
  async deleteComment(@User() user: JwtObject, @Param('id') id: string, @Param('commentId') commentId: string) {
    if (
      user.roles.includes(ProfileRole.Admin) ||
      user.access.access[UserAccessFields.CreateSocial] ||
      user.access.access[UserAccessFields.EditSocial]
    ) {
      await CommentEntity.delete(commentId);
    } else {
      await CommentEntity.delete({
        author_id: user.profile_id,
        commentable_id: id,
        id: commentId,
      });
    }

    return SocialEntity.findOne({
      where: { id },
      relations: ['manifest'],
    });

  }
}
