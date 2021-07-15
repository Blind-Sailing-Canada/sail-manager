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

  @Get('/:profileId')
  async getAccess(@Param('profileId') profileId: string) {
    return UserAccessEntity.findOneOrFail({ where: { profileId } });
  }

}
