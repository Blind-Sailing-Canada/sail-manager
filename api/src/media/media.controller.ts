import {
  BadRequestException,
  Body,
  Controller, Delete, Param, Patch, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { FindOptionsWhere } from 'typeorm';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { Media } from '../types/media/media';
import { ProfileRole } from '../types/profile/profile-role';
import { JwtObject } from '../types/token/jwt-object';
import { User } from '../user/user.decorator';
import { MediaEntity } from './media.entity';
import { MediaService } from './media.service';

@Crud({
  model: { type: MediaEntity },
  routes: { only: [
    'getManyBase',
    'getOneBase'
  ], },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: {
    alwaysPaginate: true,
    exclude: ['id'], // https://github.com/nestjsx/crud/issues/788
    join: { posted_by: { eager: true }, },
    sort: [
      {
        field: 'created_at',
        order: 'DESC',
      },
    ],
  },
})
@Controller('media')
@ApiTags('media')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class MediaController {
  constructor(public service: MediaService, private firebaseAdminService: FirebaseAdminService) { }

  @Delete('/:media_id')
  async delete(
  @User() user: JwtObject, @Param('media_id') media_id) {
    if (!media_id) {
      throw new BadRequestException('must provide media id');
    }

    let media: MediaEntity;

    if (user.roles.includes(ProfileRole.Admin)) {
      media = await MediaEntity.findOneOrFail({ where: { id:  media_id } });
    } else {
      media = await MediaEntity.findOneOrFail({ where: {
        id:  media_id,
        posted_by_id: user.profile_id
      } });
    }

    if (media.url.startsWith('cdn/')) {
      await this.firebaseAdminService.deleteFile(media.url);
    }

    await media.remove();
  }

  @Patch('/:media_id')
  async patch(@User() user: JwtObject, @Param('media_id') media_id, @Body() body: Partial<Media>) {
    const update_data: Partial<Media> = {
      description: body.description,
      title: body.title,
    };

    let condition: FindOptionsWhere<MediaEntity>;

    if (user.roles.includes(ProfileRole.Admin)) {
      condition = { id: media_id };
    } else {
      condition = {
        id: media_id,
        posted_by_id: user.profile_id
      };
    }

    await MediaEntity.update(
      condition,
      update_data
    );

    return MediaEntity.findOneOrFail({ where: { id: media_id } });
  }
}
