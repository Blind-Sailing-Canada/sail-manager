import {
  BadRequestException,
  Controller, Delete, Get, Param, Query, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { MediaEntity } from './media.entity';
import { MediaService } from './media.service';

@Controller('media')
@ApiTags('media')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class MediaController {
  constructor(public service: MediaService, private firebaseAdminService: FirebaseAdminService) { }

  @Get('/')
  async get(@Query() query) {
    return MediaEntity.find({
      where : JSON.parse(query?.q ?? '{}'),
      order: { created_at: 'DESC' }
    });
  }

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
