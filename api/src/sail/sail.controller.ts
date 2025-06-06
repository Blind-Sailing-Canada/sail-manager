import {
  Body,
  Controller, Get, Param, Patch, Post, Query, UnauthorizedException, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Crud, CrudController, CrudRequest, Override, ParsedRequest
} from '@nestjsx/crud';
import {
  FindOptionsOrder,
  In, MoreThanOrEqual, Not
} from 'typeorm';
import { BoatEntity } from '../boat/boat.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { SailManifestEntity } from '../sail-manifest/sail-manifest.entity';
import { SailRequestEntity } from '../sail-request/sail-request.entity';
import { SailorRole } from '../types/sail-manifest/sailor-role';
import { SailRequestStatus } from '../types/sail-request/sail-request-status';
import { Sail } from '../types/sail/sail';
import { SailEntity } from './sail.entity';
import { SailService } from './sail.service';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtObject } from '../types/token/jwt-object';
import { User } from '../user/user.decorator';
import { UserAccess } from '../user-access/user-access.decorator';
import { UserAccessFields } from '../types/user-access/user-access-fields';
import { SailStatus } from '../types/sail/sail-status';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SailUpdateJob } from '../types/sail/sail-update-job';
import { PaginatedSail } from '../types/sail/paginated-sail';
import { unflatten } from 'flat';
import { UserAccessGuard } from '../guards/user-access.guard';
import { ProfileRole } from '../types/profile/profile-role';
import { BoatMaintenanceEntity } from '../boat-maintenance/boat-maintenance.entity';

@Crud({
  model: { type: SailEntity },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    }
  },
  query: {
    alwaysPaginate: true,
    exclude: ['id'], // https://github.com/nestjsx/crud/issues/788
    join: {
      boat: { eager: true },
      'boat.checklist': { eager: true },
      'boat.instructions': { eager: true },
      cancelled_by: { eager: true },
      checklists: { eager: true },
      maintenance: { eager: true },
      manifest: { eager: true },
      'manifest.profile': { eager: true },
      'manifest.guest_of': { eager: true },
      comments: { eager: true },
      'comments.author': {
        eager: true,
        alias: 'comment_author',
      },
      'comments.replies': {
        eager: true,
        alias: 'comment_replies',
      },
      'comments.replies.author': {
        eager: true,
        alias: 'comment_replies_author',
      },
    },
  },
  routes: {
    createOneBase: {
      decorators: [
        UserAccess(UserAccessFields.CreateSail),
        UseGuards(UserAccessGuard),
      ]
    },
    only: [
      'createOneBase',
      'getOneBase',
    ]
  },
})
@Controller('sail')
@ApiTags('sail')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, UserAccessGuard)
export class SailController {

  constructor(
    public service: SailService,
    @InjectQueue('sail') private readonly sailQueue: Queue,
  ) { }

  get base(): CrudController<Sail> {
    return this;
  }

  @Override()
  @UserAccess(UserAccessFields.CreateSail)
  async createOne(@ParsedRequest() req: CrudRequest, @Body() dto: Sail, @User() user: JwtObject) {
    dto.created_by_id = user.profile_id;

    const sail = await this.base.createOneBase(req, dto);

    if (sail.maintenance_id) {
      await BoatMaintenanceEntity.update({ id: sail.maintenance_id }, { maintenance_sail_id: sail.id });
    }

    return sail;
  }

  @Get('/number/:number')
  async getSailByNumber(@Param('number') sail_number: number) {
    return this.service.getFullyResolvedSail(`${sail_number}`);
  }

  @Patch('/:sail_id')
  async updateSail(@User() user: JwtObject, @Param('sail_id') sail_id: string, @Body() sail_data: Sail) {
    const sail_manifest = await SailManifestEntity.findOne({
      where: {
        sail_id: sail_id,
        profile_id: user.profile_id,
        sailor_role: SailorRole.Skipper,
      },
      loadEagerRelations: false,
    });

    let canEdit = !!sail_manifest;

    canEdit = canEdit || user.access[UserAccessFields.EditSail] === true;
    canEdit = canEdit || user.access[UserAccessFields.CreateSail] === true;

    if (!canEdit) {
      throw new UnauthorizedException('not authorized to edit sails.');
    }

    delete sail_data.created_by;
    delete sail_data.created_by_id;

    await SailEntity.update(sail_id, sail_data);

    const job: SailUpdateJob = {
      message: '',
      sail_id,
    };

    this.sailQueue.add('update-sail', job);

    return this.service.getFullyResolvedSail(sail_id);
  }

  @Get('/available')
  async availableSails(@User() user: JwtObject) {
    const futureSails = await SailEntity.find({
      relations: [
        'boat',
        'manifest'
      ],
      where: {
        status: SailStatus.New,
        start_at: MoreThanOrEqual(new Date()),
        is_private: Not<true>(true)
      },
      order: { start_at: 'ASC' },
      loadEagerRelations: false,
    });

    return futureSails
      .filter(sail => !sail.manifest.some(sailor => sailor.profile_id === user.profile_id))
      .filter(sail => sail.manifest.length < sail.max_occupancy);
  }

  @Get('/')
  search(@Query() query) {
    return this.findSails(query);
  }

  @Get('available-boats')
  async availableBoats(@Query() times: { start: string, end: string }) {
    const sailsDuringThisTime = await SailEntity
      .getRepository()
      .createQueryBuilder('sail')
      .where(
        `
          status NOT IN ('${SailStatus.Cancelled}', '${SailStatus.Completed}') AND
          ((start_at <= '${times.start}'::timestamp with time zone AND end_at >= '${times.start}'::timestamp with time zone) OR
          (start_at <= '${times.end}'::timestamp with time zone AND end_at >= '${times.end}'::timestamp with time zone))
          `
      )
      .getMany();

    const boat_idsInUse = sailsDuringThisTime.map(sail => sail.boat_id);

    if (boat_idsInUse.length) {
      return BoatEntity.find({ where: { id: Not(In(boat_idsInUse)) } });
    } else {
      return BoatEntity.find();
    }
  }

  @Post('/sail-request')
  @UserAccess(UserAccessFields.CreateSail)
  async createFromSailRequest(@User() user: JwtObject, @Body() sailInfo: { sail: Partial<Sail>, sail_request_id: string }) {
    const createdSailId = await this.service.repository.manager.transaction(async transactionalEntityManager => {
      const sail_request = await SailRequestEntity
        .findOneOrFail(
          {
            relations: [
              'requested_by',
              'interest',
              'interest.profile',
            ],
            where: { id: sailInfo.sail_request_id },
          });

      let sail = SailEntity.create({
        ...sailInfo.sail,
        description: sail_request.details,
        sail_request_id: sailInfo.sail_request_id,
        category: sail_request.category || 'other',
        created_by_id: user.profile_id,
      });

      sail = await transactionalEntityManager.save(sail);

      const result = await transactionalEntityManager
        .update(
          SailRequestEntity,
          { id: sailInfo.sail_request_id }, {
          sail_id: sail.id,
          status: SailRequestStatus.Scheduled,
        });

      if (result.affected !== 1) {
        throw new Error(`SailRequest(${sailInfo.sail_request_id}) was not updated.`);
      }

      const manifest = sail_request
        .interest
        .map(sailor => SailManifestEntity.create({
          profile_id: sailor.profile_id,
          person_name: sailor.profile.name,
          sail_id: sail.id,
          sailor_role: sailor.profile.roles.includes(ProfileRole.Member) ? SailorRole.Member : SailorRole.Sailor,
        }));

      await transactionalEntityManager.save(manifest);

      return sail.id;
    });

    return this.service.getFullyResolvedSail(createdSailId);
  }

  private async findSails(query, isDownload = false): Promise<PaginatedSail> {
    const sailStatus = query.sailStatus;
    const sailName = query.sailName;
    const boatName = query.boatName;
    const sailorNames = [].concat(query.sailorNames).filter(Boolean);
    const start = query.sailStart;
    const end = query.sailEnd;
    const sort = query.sort;
    const pageIndex = (query.page || 1) - 1;
    const perPage = query.per_page || 20;
    const skip = pageIndex * perPage;

    let searchQuery = SailEntity.getRepository().createQueryBuilder('sail').leftJoin('sail.boat', 'boat');

    if (sailStatus) {
      searchQuery = searchQuery
        .andWhere('sail.status=:sailStatus', { sailStatus });
    }

    if (sailName) {
      searchQuery = searchQuery
        .andWhere('sail.name ILIKE :sailName', { sailName: `%${sailName}%` });
    }

    if (start) {
      searchQuery = searchQuery
        .andWhere('sail.start_at >= :start', { start });
    }

    if (end) {
      searchQuery = searchQuery
        .andWhere('sail.end_at <= :end', { end });
    }

    if (boatName) {
      searchQuery = searchQuery
        .andWhere('boat.name ILIKE :boatName', { boatName: `%${boatName}%` });
    }

    if (sailorNames?.length) {
      searchQuery = searchQuery
        .leftJoin('sail.manifest', 'manifest')
        .leftJoin('manifest.profile', 'profile')
        .groupBy('manifest.sail_id, sail.id')
        .having(`COUNT(*) >= ${sailorNames.length}`);

      const sailorSearchQuery = sailorNames
        .map((_, index) => `manifest.person_name ILIKE :sailorName${index} OR profile.name ILIKE :sailorName${index}`)
        .join(' OR ');

      const sailNameData = sailorNames.reduce((red, sailorName, index) => {
        red[`sailorName${index}`] = `%${sailorName}%`;
        return red;
      }, {});

      searchQuery = searchQuery.andWhere(`(${sailorSearchQuery})`, sailNameData);
    }

    let order: FindOptionsOrder<SailEntity> = { start_at: 'DESC' };

    if (sort) {
      const sortParts = sort.split(',');
      order = { [sortParts[0]]: sortParts[1] };
    }

    Object.keys(order).forEach((key) => {
      let finalKey = key;

      if (!key.startsWith('boat.')) {
        finalKey = `sail.${key}`;
      }

      searchQuery = searchQuery.addOrderBy(finalKey, order[key]);
    });

    const foundSails = await searchQuery.select('sail.id').getMany();

    const total = foundSails.length;

    const sail_ids = isDownload ? foundSails.map(sail => sail.id) : foundSails.slice(skip).slice(0, perPage).map(sail => sail.id);

    let sails = [];

    if (sail_ids.length) {
      sails = await SailEntity
        .find({
          order: unflatten(order),
          relations: ['boat'],
          where: { id: In(sail_ids) },
          loadEagerRelations: false,
        });
    }

    return {
      count: sail_ids.length,
      data: sails,
      page: pageIndex + 1,
      pageCount: Math.ceil(total / perPage),
      total,
    };
  }

}
