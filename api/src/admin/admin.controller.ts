import {
  Controller,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RolesGuard } from '../guards/roles.guard';
import { UserRoles } from '../guards/user-roles.decorator';
import { ProfileRole } from '../types/profile/profile-role';
import { AdminService } from './admin.service';

@Controller('admin')
@ApiTags('admin')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
@UserRoles(ProfileRole.Admin)
export class AdminController {
  constructor(public service: AdminService) { }
}
