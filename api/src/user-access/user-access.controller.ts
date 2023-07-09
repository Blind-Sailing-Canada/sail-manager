import {
  Controller, Get, Param, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RolesGuard } from '../guards/roles.guard';
import { UserRoles } from '../guards/user-roles.decorator';
import { ProfileRole } from '../types/profile/profile-role';
import { UserAccessEntity } from './user-access.entity';

@Controller('user-access')
@ApiTags('user-access')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
export class UserAccessController {

  @Get('/:profile_id')
  @UserRoles(ProfileRole.Admin)
  async getAccess(@Param('profile_id') profile_id: string) {
    return UserAccessEntity.findOneOrFail({ where: { profile_id } });
  }

}
