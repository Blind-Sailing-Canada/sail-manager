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

  @Get('/:sailId/pictures')
  async getSailPictures(@Param('sailId') sailId) {
    return MediaEntity.find({
      relations: ['postedBy'],
      where : { mediaForId: sailId },
    });
  }

  @Put('/:sailId/pictures')
  async addSailPictures(@User() user: JwtObject, @Param('sailId') sailId, @Body(new SailPicturesCreateSanitizer()) pictures: Partial<Media[]>) {

    pictures.forEach(picture =>{
      picture.mediaForId = sailId;
      picture.mediaForType = 'SailEntity';
      picture.postedById = user.profileId;
    });

    const media = MediaEntity.create(pictures);
    await MediaEntity.save(media);

    return MediaEntity.find({
      relations: ['postedBy'],
      where : { mediaForId: sailId },
    });
  }

  @Delete('/:sailId/pictures/:pictureId')
  async deleteSailPictures(@Param('sailId') sailId, @Param('pictureId') pictureId) {
    const picture = await MediaEntity.findOne(pictureId);

    if (picture.url.startsWith('cdn/')) {
      await this.firebaseAdminService.deleteFile(picture.url);
    }

    await picture.remove();

    return MediaEntity.find({
      relations: ['postedBy'],
      where : { mediaForId: sailId },
    });
  }

}
