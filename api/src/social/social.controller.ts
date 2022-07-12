import {
  Body,
  Controller,  Get,  Param,  Patch, Post, UnauthorizedException, UseGuards
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
import { ProfileRole } from '../types/profile/profile-role';

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
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class SocialController {

  constructor(public service: SocialService) { }

  @Post('/')
  async createSocial(@User() user: JwtObject, @Body() social_data: Social) {
    const canCreate = user.roles.includes(ProfileRole.Admin) || !!user.access.access.createSocial;

    if (!canCreate) {
      throw new UnauthorizedException('not authorized to create socials.');
    }

    const social = await SocialEntity.save(SocialEntity.create(social_data));

    return SocialEntity.findOne({ where: { id: social.id } });
  }

  @Patch('/:social_id')
  async updateSocial(@User() user: JwtObject, @Param('social_id') social_id: string, @Body() social_data: Social) {
    const canEdit = user.roles.includes(ProfileRole.Admin) || !!user.access.access.createSocial || !!user.access.access.editSocial;

    if (!canEdit) {
      throw new UnauthorizedException('not authorized to edit socials.');
    }

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
