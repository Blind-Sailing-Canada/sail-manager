import {
  Controller, Get, Param, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { UserAccessEntity } from './user-access.entity';

@Controller('user-access')
@ApiTags('user-access')
@UseGuards(JwtGuard, LoginGuard)
export class UserAccessController {

  @Get('/:profile_id')
  async getAccess(@Param('profile_id') profile_id: string) {
    return UserAccessEntity.findOneOrFail({ where: { profile_id } });
  }

}
