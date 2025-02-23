import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
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
import { GoogleGroupService } from '../google-api/google-group.service';

@Controller('admin')
@ApiTags('admin')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
@UserRoles(ProfileRole.Admin)
export class AdminController {
  constructor(
    public service: AdminService,
    private readonly groupService: GoogleGroupService
  ) { }

  @Get('/crew-group-members')
  async getCrewGroupMembers() {
    const group = process.env.GOOGLE_GROUP_CREW;
    if (!group) {
      return [];
    }
    return this.groupService.listGroupMembers(group);
  }

  @Get('/skipper-group-members')
  async getSkipperGroupMembers() {
    const group = process.env.GOOGLE_GROUP_SKIPPERS;
    if (!group) {
      return [];
    }
    return this.groupService.listGroupMembers(group);
  }

  @Get('/member-group-members')
  async getMemberGroupMembers() {
    const group = process.env.GOOGLE_GROUP_MEMBERS;
    if (!group) {
      return [];
    }
    return this.groupService.listGroupMembers(group);
  }

  @Put('/skipper-group-members')
  async addSkipper(@Body('email') email) {
    const group = process.env.GOOGLE_GROUP_SKIPPERS;
    if (!group) {
      return [];
    }

    if (typeof email !== 'string') {
      return;
    }

    return this.groupService.addGroupMember(group, email);
  }

  @Put('/crew-group-members')
  async addCrew(@Body('email') email) {
    const group = process.env.GOOGLE_GROUP_CREW;
    if (!group) {
      return [];
    }

    if (typeof email !== 'string') {
      return;
    }

    return this.groupService.addGroupMember(group, email);
  }

  @Put('/member-group-members')
  async addMember(@Body('email') email) {
    const group = process.env.GOOGLE_GROUP_MEMBERS;
    if (!group) {
      return [];
    }

    if (typeof email !== 'string') {
      return;
    }

    return this.groupService.addGroupMember(group, email);
  }

  @Patch('/member-group-members')
  async removeMember(@Body('email') email) {
    const group = process.env.GOOGLE_GROUP_MEMBERS;
    if (!group) {
      return [];
    }

    if (typeof email !== 'string') {
      return;
    }

    return this.groupService.removeGroupMember(group, email);
  }

  @Patch('/crew-group-members')
  async removeCrew(@Body('email') email) {
    const group = process.env.GOOGLE_GROUP_CREW;
    if (!group) {
      return [];
    }

    if (typeof email !== 'string') {
      return;
    }

    return this.groupService.removeGroupMember(group, email);
  }

  @Patch('/skipper-group-members')
  async removeSkipper(@Body('email') email) {
    const group = process.env.GOOGLE_GROUP_SKIPPERS;
    if (!group) {
      return [];
    }

    if (typeof email !== 'string') {
      return;
    }

    return this.groupService.removeGroupMember(group, email);
  }
}
