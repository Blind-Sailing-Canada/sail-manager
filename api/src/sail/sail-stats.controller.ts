import {
  BadRequestException,
  Controller, Get, Param, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';



import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';

import { SailService } from './sail.service';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { ProfileRole } from '../types/profile/profile-role';
import { UserRoles } from '../guards/user-roles.decorator';
import { RolesGuard } from '../guards/roles.guard';

@Controller('sail-stats')
@ApiTags('sail-stats')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
@UserRoles(ProfileRole.Admin)
export class SailStatsController {

  constructor(
    public service: SailService,
  ) { }

  @Get('/user-sails/:year')
  async userSails(@Param('year') year: string) {
    if (typeof +year !== 'number') {
      throw new BadRequestException('Year must be an integer.');
    }

    return this.service
      .dataSource
      .query(
        `
        SELECT p.name, p.email, p.id, COUNT(m.profile_id) AS sails
        FROM sail_manifests m
        INNER JOIN (
            SELECT *
            FROM sails s
            WHERE
              s.status != 'cancelled' AND
              EXTRACT(YEAR FROM s.end_at) = ${+year}
        ) s ON m.sail_id = s.id
        INNER JOIN profiles p ON p.id = m.profile_id
        WHERE
          p.deleted_at IS NULL AND
          m.profile_id IS NOT NULL
        GROUP BY p.name, p.id, p.email
        ORDER BY p.name ASC;
        `
      );
  }

  @Get('/cancelled-sails/:year')
  async cancelledSails(@Param('year') year: string) {
    if (typeof +year !== 'number') {
      throw new BadRequestException('Year must be an integer.');
    }

    return this.service
      .dataSource
      .query(
        `
        SELECT s.name, s.id, s.start_at, s.end_at, s.cancelled_at, p.name as cancelled_by, s.cancelled_by_id, s.cancel_reason
        FROM sails s
        LEFT JOIN profiles p ON p.id = s.cancelled_by_id
        WHERE
        s.status = 'cancelled' AND
        EXTRACT(YEAR FROM s.end_at) = ${+year}
        ORDER BY s.start_at ASC;
        `
      );
  }

  @Get('/boat-sails/:year')
  async boatSails(@Param('year') year: string) {
    if (typeof +year !== 'number') {
      throw new BadRequestException('Year must be an integer.');
    }

    return this.service
      .dataSource
      .query(
        `
        SELECT b.name as boat_name, s.boat_id, COUNT(s.boat_id) AS sails
        FROM sails s
        INNER JOIN boats b ON b.id = s.boat_id
        WHERE
          b.deleted_at IS NULL AND
          s.status != 'cancelled' AND
          EXTRACT(YEAR FROM s.end_at) = ${+year}
        GROUP BY s.boat_id, b.name
        ORDER BY b.name ASC;
        `
      );
  }

}
