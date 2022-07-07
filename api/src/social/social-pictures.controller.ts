import {
  BadRequestException,
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
import { SocialPicturesCreateSanitizer } from './pipes/social-pictures-create.sanitizer';

@Controller('social')
@ApiTags('social')
@UseGuards(JwtGuard, LoginGuard)
export class SocialPicturesController {

  constructor(private firebaseAdminService: FirebaseAdminService) {}

  @Get('/:social_id/pictures')
  async getSocialPictures(@Param('social_id') social_id) {
    return MediaEntity.find({ where : { media_for_id: social_id } });
  }

  @Put('/:social_id/pictures')
  async addSocialPictures(
  @User() user: JwtObject,
    @Param('social_id') social_id,
    @Body(new SocialPicturesCreateSanitizer()) pictures: Partial<Media[]>
  ) {

    pictures.forEach(picture =>{
      picture.media_for_id = social_id;
      picture.media_for_type = 'SocialEntity';
      picture.posted_by_id = user.profile_id;
    });

    const media = MediaEntity.create(pictures);
    await MediaEntity.save(media);

    return MediaEntity.find({ where : { media_for_id: social_id } });
  }

  @Delete('/:social_id/pictures/:pictureId')
  async deleteSocialPictures(@Param('social_id') social_id, @Param('pictureId') media_id) {
    if (!media_id) {
      throw new BadRequestException('must provide media id');
    }

    const media = await MediaEntity.findOne({ where: { id:  media_id } });

    if (media.url.startsWith('cdn/')) {
      await this.firebaseAdminService.deleteFile(media.url);
    }

    await media.remove();

    return MediaEntity.find({ where : { media_for_id: social_id } });
  }

}
