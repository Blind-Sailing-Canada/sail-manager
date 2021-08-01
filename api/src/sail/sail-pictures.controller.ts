import {
  Body,
  Controller, Delete, Get, Param,  Put, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FirebaseAdminService } from '../firebase-admin/firebase-admin.service';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { MediaEntity } from '../media/media.entity';
import { Media } from '../types/media/media';
import { JwtObject } from '../types/token/jwt-object';
import { User } from '../user/user.decorator';
import { SailPicturesCreateSanitizer } from './pipes/sail-pictures-create.sanitizer';

@Controller('sail')
@ApiTags('sail')
@UseGuards(JwtGuard, LoginGuard)
export class SailPicturesController {

  constructor(private firebaseAdminService: FirebaseAdminService) {}

  @Get('/:sail_id/pictures')
  async getSailPictures(@Param('sail_id') sail_id) {
    return MediaEntity.find({ where : { media_for_id: sail_id } });
  }

  @Put('/:sail_id/pictures')
  async addSailPictures(@User() user: JwtObject, @Param('sail_id') sail_id, @Body(new SailPicturesCreateSanitizer()) pictures: Partial<Media[]>) {

    pictures.forEach(picture =>{
      picture.media_for_id = sail_id;
      picture.media_for_type = 'SailEntity';
      picture.posted_by_id = user.profile_id;
    });

    const media = MediaEntity.create(pictures);
    await MediaEntity.save(media);

    return MediaEntity.find({ where : { media_for_id: sail_id } });
  }

  @Delete('/:sail_id/pictures/:pictureId')
  async deleteSailPictures(@Param('sail_id') sail_id, @Param('pictureId') pictureId) {
    const picture = await MediaEntity.findOne(pictureId);

    if (picture.url.startsWith('cdn/')) {
      await this.firebaseAdminService.deleteFile(picture.url);
    }

    await picture.remove();

    return MediaEntity.find({ where : { media_for_id: sail_id } });
  }

}
