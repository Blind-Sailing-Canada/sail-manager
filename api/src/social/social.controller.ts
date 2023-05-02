import {
  Body,
  Controller,  Get,  Param,  Patch, Post, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { MoreThanOrEqual, } from 'typeorm';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtObject } from '../types/token/jwt-object';
import { User } from '../user/user.decorator';
import { SocialEntity } from './social.entity';
import { SocialService } from './social.service';
import { SocialStatus } from '../types/social/social-status';
import { Social } from '../types/social/social';
import { UserAccess } from '../user-access/user-access.decorator';
import { UserAccessFields } from '../types/user-access/user-access-fields';
import { UserAccessGuard } from '../guards/user-access.guard';

@Crud({
  model: { type: SocialEntity },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: {
    alwaysPaginate: true,
    exclude: ['id'], // https://github.com/nestjsx/crud/issues/788
    join: {
      manifest: { eager: true },
      'manifest.profile': { eager: true },
      'manifest.guest_of': { eager: true },
      cancelled_by: { eager: true },
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
  routes: { only: [
    'getOneBase',
    'getManyBase'
  ] },
})
@Controller('social')
@ApiTags('social')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, UserAccessGuard)
export class SocialController {

  constructor(public service: SocialService) { }

  @Post('/')
  @UserAccess(UserAccessFields.CreateSocial)
  async createSocial(@User() user: JwtObject, @Body() social_data: Social) {
    const social = await SocialEntity.save(SocialEntity.create({
      ...social_data,
      created_by_id: user.profile_id
    }));

    return SocialEntity.findOne({ where: { id: social.id } });
  }

  @Patch('/:social_id')
  @UserAccess(UserAccessFields.EditSocial, UserAccessFields.CreateSocial)
  async updateSocial(@User() user: JwtObject, @Param('social_id') social_id: string, @Body() social_data: Social) {

    delete social_data.created_by;
    delete social_data.created_by_id;

    await SocialEntity.update(social_id, social_data);

    return SocialEntity.findOne({ where: { id: social_id } });
  }

  @Get('/available')
  async availableSocials(@User() user: JwtObject ) {
    const futureSocials = await SocialEntity.find({ where: {
      status: SocialStatus.New,
      start_at: MoreThanOrEqual(new Date()),
    } });

    return futureSocials
      .filter(social => !social.manifest.some(attendant => attendant.profile_id === user.profile_id))
      .filter(social => social.manifest.length < social.max_attendants);
  }

}
