import {
  Controller,  Get, Headers, Logger, Param, Query, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
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
import { SailService } from './sail.service';

@Crud({
  model: { type: SailEntity },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: {
    alwaysPaginate: true,
    exclude: ['id'], // https://github.com/nestjsx/crud/issues/788
    join: {
      boat: { eager: true },
      manifest: { eager: true },
      'manifest.profile': { eager: true },
      'manifest.guest_of': { eager: true },
    },
  },
  routes: { only: ['getManyBase'] },
})
@Controller('user_sails')
@ApiTags('user_sails')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class UserSailController {
  private readonly logger = new Logger(UserSailController.name);

  constructor(public service: SailService) { }

  @Get('/:profile_id/count')
  async count(@Param('profile_id') profile_id) {
    return SailManifestEntity.count({ where: { profile_id } });
  }

  @Get('/in-progress')
  async inProgressSails(@Query('profile_id') profile_id, @Query('limit') take: 10) {
    const where = { status: SailStatus.Started } as FindOptionsWhere<SailEntity>;

    if (profile_id) {
      where.manifest = { profile_id };
    }

    const sails = await SailEntity.find({
      take: Number.isInteger(+take) ? +take : 10,
      where,
      order: { start_at: 'ASC' },
      relations: ['manifest'],
      loadEagerRelations: false,
      select: [
        'id',
        'start_at'
      ]
    });

    return SailEntity.find({
      where: { id: In(sails.map(sail => sail.id)) },
      order: { start_at: 'ASC' },
      relations: [
        'boat',
        'manifest'
      ],
      loadEagerRelations: false,
    });
  }

  @Get('/past')
  async pastSails(@Query('profile_id') profile_id, @Query('limit') take: 5) {
    const where = { end_at: LessThan(new Date()) } as FindOptionsWhere<SailEntity>;

    if (profile_id) {
      where.manifest = { profile_id };
    }

    const sails = await SailEntity.find({
      take: Number.isInteger(+take) ? +take : 5,
      where,
      order: { start_at: 'DESC' },
      relations: ['manifest'],
      loadEagerRelations: false,
      select: [
        'id',
        'start_at'
      ]
    });

    return SailEntity.find({
      where: { id: In(sails.map(sail => sail.id)) },
      order: { start_at: 'DESC' },
      relations: [
        'boat',
        'manifest'
      ],
      loadEagerRelations: false,
    });
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
          take: Number.isInteger(+take) ? +take : 5,
          where,
          order: { start_at: 'ASC' },
          relations: ['manifest'],
          loadEagerRelations: false,
          select: [
            'id',
            'start_at'
          ]
        }
      );

    return SailEntity.find({
      where: { id: In(sails.map(sail => sail.id)) },
      order: { start_at: 'ASC' },
      relations: [
        'boat',
        'manifest'
      ],
      loadEagerRelations: false,
    });
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

    const sailsQuery = SailEntity
      .getRepository()
      .createQueryBuilder('sail')
      .select('sail.id')
      .where(where);

    if (profile_id) {
      sailsQuery.innerJoin(SailManifestEntity, 'manifest', 'manifest.sail_id = sail.id AND profile_id = :profile_id', { profile_id });
    }

    const sailIds = (await  sailsQuery.getMany()).map(sail => sail.id);

    if (!sailIds.length) {
      return [];
    }

    const sails = await SailEntity.find({
      where: { id: In(sailIds) },
      relations: [
        'boat',
        'manifest'
      ],
      loadEagerRelations: false,
    });

    return sails;
  }

}
