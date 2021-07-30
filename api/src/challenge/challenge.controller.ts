import { InjectQueue } from '@nestjs/bull';
import {
  Body, Controller, Delete, Param, Patch, Post, UnauthorizedException, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Queue } from 'bull';
import { CommentEntity } from '../comment/comment.entity';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { MediaEntity } from '../media/media.entity';
import { Media } from '../types/media/media';
import { ProfileRole } from '../types/profile/profile-role';
import { JwtObject } from '../types/token/jwt-object';
import { UserAccessFields } from '../types/user-access/user-access-fields';
import { User } from '../user/user.decorator';
import { ChallengeParticipantEntity } from './challenge-participant.entity';
import { ChallengeEntity } from './challenge.entity';
import { ChallengeService } from './challenge.service';

@Crud({
  model: { type: ChallengeEntity },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: {
    alwaysPaginate: false,
    join: {
      participants: { eager: true },
      'participants.participant': { eager: true },
      comments: { eager: true },
      pictures: { eager: true },
      'pictures.posted_by': { eager: true },
      'comments.author': {
        eager: true,
        alias: 'comment_author',
      },
      'comments.replies': {
        eager: true,
        alias: 'comment_replies',
      },
      'comments.replies.author': {
        eager: true,
        alias: 'comment_replies_author',
      },
    },
  },
})
@Controller('challenge')
@ApiTags('challenge')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class ChallengeController {
  constructor(public service: ChallengeService,
    @InjectQueue('challenge') private readonly challengeQueue: Queue) { }

  @Patch('/:id/accomplished-by/:profile_id')
  async setAccomplishedBy(@User() user: JwtObject, @Param('id') id: string, @Param('profile_id') profile_id: string, @Body() note: {note: string}) {
    if (user.profile_id !== profile_id && !user.access.access[UserAccessFields.JudgeChallenge]) {
      throw new UnauthorizedException();
    }

    await ChallengeParticipantEntity.update({
      challenge_id: id,
      participant_id: profile_id,
    }, {
      finished_at: new Date(),
      note:  note.note,
    });

    return ChallengeEntity.findOne({ where: { id } });
  }

  @Post('/:id/join')
  async join(@User() user: JwtObject, @Param('id') challenge_id: string) {
    const participant = ChallengeParticipantEntity.create();
    participant.participant_id = user.profile_id;
    participant.challenge_id = challenge_id;

    await participant
      .save()
      .then(() => this.challengeQueue.add('new-attendee', {
        challenge_id,
        profile_id: user.profile_id,
      }));

    return ChallengeEntity.findOne({ where: { id: challenge_id } });
  }

  @Delete('/:id/leave')
  async leave(@User() user: JwtObject, @Param('id') id: string) {
    await ChallengeParticipantEntity.delete({
      participant_id: user.profile_id,
      challenge_id: id,
    });

    return ChallengeEntity.findOne({ where: { id } });
  }

  @Patch('/:id/pictures')
  async addPictures(@User() user: JwtObject, @Param('id') id: string, @Body() pictures: Partial<Media>[]) {
    const newPictures = MediaEntity.create(pictures);

    newPictures.forEach(picture => {
      picture.media_for_id = id;
      picture.media_for_type = ChallengeEntity.name;
      picture.posted_by_id = user.profile_id;
    });

    await MediaEntity.save(newPictures);

    return ChallengeEntity.findOne({ where: { id } });
  }

  @Delete('/:id/pictures/:pictureId')
  async removePicture(@User() user: JwtObject, @Param('id') id: string, @Param('pictureId') pictureId: string) {
    if (user.access.access[UserAccessFields.DeletePictures]) {
      await MediaEntity.delete(pictureId);
    } else {
      await MediaEntity.delete({
        id: pictureId,
        posted_by_id: user.profile_id,
      });
    }

    return ChallengeEntity.findOne({ where: { id } });
  }

  @Post('/:id/comments')
  async postComment(@User() user: JwtObject, @Param('id') challenge_id: string, @Body() commentInfo: Partial<Comment>) {
    const comment = CommentEntity.create(commentInfo);

    comment.author_id = user.profile_id;
    comment.created_at = new Date();
    comment.commentable_id = challenge_id;
    comment.commentable_type = ChallengeEntity.name;

    await comment
      .save()
      .then((savedComment) => this.challengeQueue.add('new-comment', {
        challenge_id,
        commentId: savedComment.id,
      }));

    return ChallengeEntity.findOne({ where: { id: challenge_id } });
  }

  @Delete('/:id/comments/:commentId')
  async deleteComment(@User() user: JwtObject, @Param('id') id: string, @Param('commentId') commentId: string) {
    if (
      user.roles.includes(ProfileRole.Admin) ||
      user.access.access[UserAccessFields.CreateChallenge] ||
      user.access.access[UserAccessFields.EditChallenge]
    ) {
      await CommentEntity.delete(commentId);
    } else {
      await CommentEntity.delete({
        author_id: user.profile_id,
        commentable_id: id,
        id: commentId,
      });
    }

    return ChallengeEntity.findOne({ where: { id } });
  }
}
