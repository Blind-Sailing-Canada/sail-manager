import {
  Controller,  Get, Headers, Param, Query, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  LessThan,
  MoreThan
} from 'typeorm';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { SailManifestEntity } from '../sail-manifest/sail-manifest.entity';
import { SailStatus } from '../types/sail/sail-status';
import { SailEntity } from './sail.entity';

@Controller('sail/user')
@ApiTags('sail/user')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class UserSailController {

  @Get('/:profile_id/count')
  async count(@Param('profile_id') profile_id) {
    return SailManifestEntity
      .count({ where: { profile_id } });
  }

  @Get('/in-progress')
  async inProgressSails(@Query('profile_id') profile_id, @Query('limit') take: 10) {
    const sails = await SailEntity.find({
      take,
      where: { status: SailStatus.Started },
    });

    if (profile_id) {
      return sails.filter(sail => sail.manifest.some(manifest => manifest.profile_id === profile_id));
    }

    return sails;
  }

  @Get('/past')
  async pastSails(@Query('profile_id') profile_id, @Query('limit') take: 5) {
    if (profile_id) {
      const manifests = await SailManifestEntity.find({
        take,
        relations: ['sail'],
        where: { profile_id },
      });

      return manifests
        .filter(manifest => new Date(manifest.sail.end_at).getTime() < Date.now())
        .map(manifest => manifest.sail);
    }

    return SailEntity.find({
      take,
      where: { end_at: LessThan(new Date()) },
    });
  }

  @Get('/future')
  async futureSails(@Query('profile_id') profile_id: string, @Query('limit') take: 5) {
    const sails = await SailEntity
      .find(
        {
          take,
          where: {
            status: SailStatus.New,
            start_at: MoreThan(new Date()),
          },
          order: { start_at: 'ASC' },
        }
      );

    if (profile_id) {
      return sails.filter(sail => sail.manifest.some(manifest => manifest.profile_id === profile_id));
    }

    return sails;
  }

  @Get('/today')
  async todaySails(@Query('profile_id') profile_id, @Headers('x-timezone') time_zone) {

    let timeZone = 'UTC';

    try {
      new Date().toLocaleString('en-US', { timeZone: time_zone });
      timeZone = time_zone;
    } catch(error) {
      console.error(error);
    }

    const localDateString = `(CURRENT_DATE AT TIME ZONE '${timeZone}')::date::text`;
    const localStartDateString = `(start_at AT TIME ZONE '${timeZone}')::date::text`;
    const localEndDateString = `(end_at AT TIME ZONE '${timeZone}')::date::text`;

    const localDate = `(CURRENT_DATE AT TIME ZONE '${timeZone}')`;
    const localStartDate = `(start_at AT TIME ZONE '${timeZone}')`;
    const localEndDate = `(end_at AT TIME ZONE '${timeZone}')`;

    const sails = await SailEntity
      .find(
        { where: `
          (${localStartDateString} = ${localDateString} OR ${localEndDateString} = ${localDateString}) OR
          (${localStartDate} < ${localDate} AND ${localEndDate} > ${localDate})
          ` }
      );

    if (profile_id) {
      return sails.filter(sail => sail.manifest.some(manifest => manifest.profile_id === profile_id));
    }

    return sails;
  }

  @Get('/all')
  async allSails(@Query('profile_id') profile_id) {
    const manifests = await SailManifestEntity
      .find({
        relations: ['sail'],
        where: { profile_id },
      });

    return manifests.map(manifest => manifest.sail);
  }
}
