import {
  BadRequestException,
  Body,
  Controller,
  Post,
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

  @Post()
  runQuery(@Body() body: { query: string }) {
    const query = body.query?.trim() || '';

    if (!query.toLowerCase().startsWith('select ')) {
      throw new BadRequestException('query must be SELECT only');
    }

    if (query.toLowerCase().includes('delete ')) {
      throw new BadRequestException('query must be SELECT only');
    }

    if (query.toLowerCase().includes('insert ')) {
      throw new BadRequestException('query must be SELECT only');
    }

    if (query.toLowerCase().includes('update ')) {
      throw new BadRequestException('query must be SELECT only');
    }

    if (query.toLowerCase().includes('alter ')) {
      throw new BadRequestException('query must be SELECT only');
    }

    if (query.toLowerCase().includes('drop ')) {
      throw new BadRequestException('query must be SELECT only');
    }

    return this.service.dataSource.query(query);
  }
}
