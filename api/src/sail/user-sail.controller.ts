import {
  Controller,  Get, Headers, Logger, Param, Query, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  FindOptionsWhere,
  In,
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
  private readonly logger = new Logger(UserSailController.name)

  @Get('/:profile_id/count')
  async count(@Param('profile_id') profile_id) {
    return SailManifestEntity
      .count({ where: { profile_id } });
  }

  @Get('/in-progress')
  async inProgressSails(@Query('profile_id') profile_id, @Query('limit') take: 10) {
    const where = { status: SailStatus.Started } as FindOptionsWhere<SailEntity>;

    if (profile_id) {
      where.manifest = { profile_id };
    }

    const sails = await SailEntity.find({
      take,
      where,
    });

    return sails;
  }

  @Get('/past')
  async pastSails(@Query('profile_id') profile_id, @Query('limit') take: 5) {
    const where = { end_at: LessThan(new Date()) } as FindOptionsWhere<SailEntity>;

    if (profile_id) {
      where.manifest = { profile_id };
    }

    const sails = await SailEntity.find({
      take,
      where,
    });

    return sails;
  }

  @Get('/future')
  async futureSails(@Query('profile_id') profile_id: string, @Query('limit') take: 5) {
    const where = {
      status: SailStatus.New,
      start_at: MoreThan(new Date()),
    } as FindOptionsWhere<SailEntity>;

    if (profile_id) {
      where.manifest = { profile_id };
    }

    const sails = await SailEntity
      .find(
        {
          take,
          where,
          order: { start_at: 'ASC' },
        }
      );

    return sails;
  }

  @Get('/today')
  async todaySails(@Query('profile_id') profile_id, @Headers('x-timezone') time_zone) {

    let timeZone = 'UTC';

    try {
      new Date().toLocaleString('en-US', { timeZone: time_zone });
      timeZone = time_zone;
    } catch(error) {
      this.logger.error(error);
    }

    const localDateString = `(NOW() AT TIME ZONE '${timeZone}')::date::text`;
    const localStartDateString = `(start_at AT TIME ZONE '${timeZone}')::date::text`;
    const localEndDateString = `(end_at AT TIME ZONE '${timeZone}')::date::text`;

    const localDate = `(NOW() AT TIME ZONE '${timeZone}')`;
    const localStartDate = `(start_at AT TIME ZONE '${timeZone}')`;
    const localEndDate = `(end_at AT TIME ZONE '${timeZone}')`;
    const where = `
    (${localStartDateString} = ${localDateString} OR ${localEndDateString} = ${localDateString})
    OR
    (${localStartDate} < ${localDate} AND ${localEndDate} > ${localDate})
    `.trim().replace(/\n/g, '').replace(/\s{2,}/g, ' ');

    const sailIds = (await SailEntity
      .getRepository()
      .createQueryBuilder('sail')
      .select('sail.id')
      .where(where)
      .getMany())
      .map(sail => sail.id);

    const sailsWhere = { id: In(sailIds) } as FindOptionsWhere<SailEntity>;

    if (profile_id) {
      sailsWhere.manifest = { profile_id };
    }

    const sails = await SailEntity.find({ where: sailsWhere });

    return sails;
  }

  @Get('/all')
  async allSails(@Query('profile_id') profile_id, @Query('limit') take = 10) {
    const sails = await SailEntity
      .find({
        take,
        order: { start_at: 'DESC' },
        where: { manifest: { profile_id } },
      });

    return sails;
  }
}
