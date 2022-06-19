import {
  BadRequestException,
  Controller, Delete, Param, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { MediaEntity } from './media.entity';
import { MediaService } from './media.service';

@Crud({
  model: { type: MediaEntity },
  routes: { only: ['getManyBase',], },
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
  async delete(@Param('media_id') media_id) {
    if (!media_id) {
      throw new BadRequestException('must provide media id');
    }

    const media = await MediaEntity.findOne({ where: { id:  media_id } });

    if (media.url.startsWith('cdn/')) {
      await this.firebaseAdminService.deleteFile(media.url);
    }

    await media.remove();
  }
}
