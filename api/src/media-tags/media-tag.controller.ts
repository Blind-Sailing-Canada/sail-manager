import {
  BadRequestException,
  Body,
  Controller, Delete, Get, Param, Post, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { MediaTag } from '../types/media-tag/media-tag';
import { MediaTagEntity } from './media-tag.entity';
import { MediaTagService } from './media-tag.service';

@Crud({
  model: { type: MediaTagEntity },
  routes: { only: [] },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: {
    alwaysPaginate: true,
    exclude: ['id'], // https://github.com/nestjsx/crud/issues/788
    join: { profile: { eager: true }, },
    sort: [
      {
        field: 'created_at',
        order: 'DESC',
      },
    ],
  },
})
@Controller('media-tag')
@ApiTags('media-tag')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class MediaTagController {
  constructor(public service: MediaTagService) { }

  @Post()
  async createOne(@Body() body: Partial<MediaTag>) {
    return MediaTagEntity.save(body).catch((error) => {
      if (error.message.includes('duplicate')) {
        throw new BadRequestException('Already tagged.');
      }

      throw new BadRequestException(error.message);
    });
  }

  @Get('/:media_id')
  getOne(@Param('media_id') media_id: string) {
    return MediaTagEntity.findOneOrFail({ where: { id: media_id } });
  }

  @Delete('/:media_id')
  deleteOne(@Param('media_id') media_id: string) {
    return MediaTagEntity.delete({ id: media_id  });
  }
}

