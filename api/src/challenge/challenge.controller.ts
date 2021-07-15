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
      'pictures.postedBy': { eager: true },
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

  @Patch('/:id/accomplished-by/:profileId')
  async setAccomplishedBy(@User() user: JwtObject, @Param('id') id: string, @Param('profileId') profileId: string, @Body() note: {note: string}) {
    if (user.profileId !== profileId && !user.access.access[UserAccessFields.JudgeChallenge]) {
      throw new UnauthorizedException();
    }

    await ChallengeParticipantEntity.update({
      challengeId: id,
      participantId: profileId,
    }, {
      finishedAt: new Date(),
      note:  note.note,
    });

    return ChallengeEntity.findOne({ where: { id } });
  }

  @Post('/:id/join')
  async join(@User() user: JwtObject, @Param('id') challengeId: string) {
    const participant = ChallengeParticipantEntity.create();
    participant.participantId = user.profileId;
    participant.challengeId = challengeId;

    await participant
      .save()
      .then(() => this.challengeQueue.add('new-attendee', {
        challengeId,
        profileId: user.profileId,
      }));

    return ChallengeEntity.findOne({ where: { id: challengeId } });
  }

  @Delete('/:id/leave')
  async leave(@User() user: JwtObject, @Param('id') id: string) {
    await ChallengeParticipantEntity.delete({
      participantId: user.profileId,
      challengeId: id,
    });

    return ChallengeEntity.findOne({ where: { id } });
  }

  @Patch('/:id/pictures')
  async addPictures(@User() user: JwtObject, @Param('id') id: string, @Body() pictures: Partial<Media>[]) {
    const newPictures = MediaEntity.create(pictures);

    newPictures.forEach(picture => {
      picture.mediaForId = id;
      picture.mediaForType = ChallengeEntity.name;
      picture.postedById = user.profileId;
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
        postedById: user.profileId,
      });
    }

    return ChallengeEntity.findOne({ where: { id } });
  }

  @Post('/:id/comments')
  async postComment(@User() user: JwtObject, @Param('id') challengeId: string, @Body() commentInfo: Partial<Comment>) {
    const comment = CommentEntity.create(commentInfo);

    comment.authorId = user.profileId;
    comment.createdAt = new Date();
    comment.commentableId = challengeId;
    comment.commentableType = ChallengeEntity.name;

    await comment
      .save()
      .then((savedComment) => this.challengeQueue.add('new-comment', {
        challengeId,
        commentId: savedComment.id,
      }));

    return ChallengeEntity.findOne({ where: { id: challengeId } });
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
        authorId: user.profileId,
        commentableId: id,
        id: commentId,
      });
    }

    return ChallengeEntity.findOne({ where: { id } });
  }
}
