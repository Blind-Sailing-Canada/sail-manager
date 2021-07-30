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

  @Post('/for-user/:profile_id')
  async saveSettinsForUser(@User() user: JwtObject, @Param('profile_id') profile_id: string, @Body() settingsInfo) {

    if (user.profile_id !== profile_id) {
      throw new UnauthorizedException();
    }

    let settings =  await SettingEntity.findOne({ profile_id });

    if (!settings) {
      settings = SettingEntity.create({ profile_id });
    }

    settings.settings = settingsInfo;

    return settings.save();
  }

  @Get('/for-user/:profile_id')
  getSettinsForUser(@User() user: JwtObject, @Param('profile_id') profile_id: string) {
    if (user.profile_id !== profile_id) {
      throw new UnauthorizedException();
    }
    return SettingEntity.findOne({ profile_id });
  }
}
