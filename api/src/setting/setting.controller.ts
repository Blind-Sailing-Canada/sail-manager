import {
  Body,
  Controller, Get, Param, Post, UnauthorizedException, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { JwtObject } from '../types/token/jwt-object';
import { User } from '../user/user.decorator';
import { SettingEntity } from './setting.entity';
import { SettingService } from './setting.service';

@Controller('setting')
@ApiTags('setting')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class SettingController {
  constructor(public service: SettingService) { }

  @Post('/for-user/:profileId')
  async saveSettinsForUser(@User() user: JwtObject, @Param('profileId') profileId: string, @Body() settingsInfo) {

    if (user.profileId !== profileId) {
      throw new UnauthorizedException();
    }

    let settings =  await SettingEntity.findOne({ profileId });

    if (!settings) {
      settings = SettingEntity.create({ profileId });
    }

    settings.settings = settingsInfo;

    return settings.save();
  }

  @Get('/for-user/:profileId')
  getSettinsForUser(@User() user: JwtObject, @Param('profileId') profileId: string) {
    if (user.profileId !== profileId) {
      throw new UnauthorizedException();
    }
    return SettingEntity.findOne({ profileId });
  }
}
