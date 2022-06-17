import { InjectQueue } from '@nestjs/bull';
import {
  Body, Controller, Delete, Param, Patch, Post, UnauthorizedException, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Queue } from 'bull';
import { CommentEntity } from '../comment/comment.entity';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { MediaEntity } from '../media/media.entity';
import { BoatMaintenance } from '../types/boat-maintenance/boat-maintenance';
import { BoatMaintenanceNewCommentJob } from '../types/boat-maintenance/boat-maintenance-new-comment-job';
import { BoatMaintenanceUpdateJob } from '../types/boat-maintenance/boat-maintenance-update-request-job';
import { Comment } from '../types/comment/comment';
import { Media } from '../types/media/media';
import { ProfileRole } from '../types/profile/profile-role';
import { JwtObject } from '../types/token/jwt-object';
import { UserAccessFields } from '../types/user-access/user-access-fields';
import { User } from '../user/user.decorator';
import { BoatMaintenanceEntity } from './boat-maintenance.entity';
import { BoatMaintenanceService } from './boat-maintenance.service';
import { MaintenanceUpdateSanitizer } from './pipes/maintenance-update.sanitizer';

@Crud({
  model: { type: BoatMaintenanceEntity },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  routes: { only: [
    'createOneBase',
    'getManyBase',
    'getOneBase',
  ] },
  query: {
    alwaysPaginate: false,
    exclude: ['id'], // https://github.com/nestjsx/crud/issues/788
    join: {
      boat: { eager: true },
      requested_by: { eager: true },
      resolved_by: { eager: true },
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
@Controller('boat-maintenance')
@ApiTags('boat-maintenance')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class BoatMaintenanceController {
  constructor(
    public service: BoatMaintenanceService,
    private firebaseService: FirebaseAdminService,
    @InjectQueue('boat-maintenance') private readonly boatMaintenanceQueue: Queue
  ) { }

  @Patch('/:id/pictures')
  async addPictures(@User() user: JwtObject, @Param('id') id: string, @Body() pictures: Partial<Media>[]) {
    const newPictures = MediaEntity.create(pictures);

    newPictures.forEach(picture => {
      picture.media_for_id = id;
      picture.media_for_type = BoatMaintenanceEntity.name;
      picture.posted_by_id = user.profile_id;
    });

    await MediaEntity.save(newPictures);

    return BoatMaintenanceEntity.findOne({ where: { id } });
  }

  @Patch('/:id')
  async update(
  @User() user: JwtObject,
    @Param('id') id: string,
    @Body(new MaintenanceUpdateSanitizer()) updateInfo: Partial<BoatMaintenance>) {
    let shouldUpdate = false;

    if (
      user.roles.includes(ProfileRole.Admin) ||
      user.roles.includes(ProfileRole.FleetManager) ||
      user.access.access[UserAccessFields.EditMaintenanceRequest] ||
      user.access.access[UserAccessFields.ResolveMaintenanceRequest]
    ) {
      shouldUpdate = true;
    }

    if (!shouldUpdate) {
      throw new UnauthorizedException();
    }

    const updated = await BoatMaintenanceEntity.update({ id }, updateInfo);

    if (updated.affected) {
      const job: BoatMaintenanceUpdateJob = { maintenance_id: id };
      this.boatMaintenanceQueue.add('update-request', job);
    }

    return BoatMaintenanceEntity.findOne({ where: { id } });
  }

  @Delete('/:id/pictures/:pictureId')
  async removePicture(@User() user: JwtObject, @Param('id') id: string, @Param('pictureId') pictureId: string) {
    const picture = await MediaEntity.findOneOrFail({ where: { id: pictureId } });

    let shouldDelete = false;

    if (
      user.roles.includes(ProfileRole.Admin) ||
      user.access.access[UserAccessFields.DeletePictures] ||
      user.access.access[UserAccessFields.CreateBoat] ||
      user.access.access[UserAccessFields.EditBoat] ||
      user.access.access[UserAccessFields.EditMaintenanceRequest]
    ) {
      shouldDelete = true;
    } else {
      shouldDelete = picture.posted_by_id === user.profile_id;
    }

    if (shouldDelete) {
      if (picture.url.startsWith('cdn/')) {
        await this.firebaseService.deleteFile(picture.url);
      }

      await MediaEntity.delete(pictureId);
    }

    return BoatMaintenanceEntity.findOne({ where: { id } });
  }

  @Post('/:id/comments')
  async postComment(@User() user: JwtObject, @Param('id') id: string, @Body() commentInfo: Partial<Comment>) {
    const comment = CommentEntity.create(commentInfo);

    comment.author_id = user.profile_id;
    comment.created_at = new Date();
    comment.commentable_id = id;
    comment.commentable_type = BoatMaintenanceEntity.name;

    const savedComment = await comment.save();

    const job: BoatMaintenanceNewCommentJob = {
      comment_id: savedComment.id,
      maintenance_id: id,
    };

    this.boatMaintenanceQueue.add('new-comment', job);

    return BoatMaintenanceEntity.findOne({ where: { id } });
  }

  @Delete('/:id/comments/:commentId')
  async deleteComment(@User() user: JwtObject, @Param('id') id: string, @Param('commentId') commentId: string) {
    if (
      user.roles.includes(ProfileRole.Admin) ||
      user.access.access[UserAccessFields.CreateBoat] ||
      user.access.access[UserAccessFields.EditBoat] ||
      user.access.access[UserAccessFields.EditMaintenanceRequest]
    ) {
      await CommentEntity.delete(commentId);
    } else {
      await CommentEntity.delete({
        author_id: user.profile_id,
        commentable_id: id,
        id: commentId,
      });
    }

    return BoatMaintenanceEntity.findOne({ where: { id } });
  }
}
