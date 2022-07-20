import {
  Body,
  Controller,  Get,  Param,  Patch,  Post,  Query, Res, UnauthorizedException, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
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
import { Parser } from 'json2csv';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtObject } from '../types/token/jwt-object';
import { User } from '../user/user.decorator';
import { UserAccess } from '../user-access/user-access.decorator';
import { UserAccessFields } from '../types/user-access/user-access-fields';
import { SailStatus } from '../types/sail/sail-status';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SailUpdateJob } from '../types/sail/sail-update-job';

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
      'boat.checklist': { eager: true },
      'boat.instructions': { eager: true },
      cancelled_by: { eager: true },
      checklists: { eager: true },
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
  routes: { only: [
    'createOneBase',
    'getOneBase',
  ] },
})
@Controller('sail')
@ApiTags('sail')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class SailController {

  constructor(
    public service: SailService,
    @InjectQueue('sail') private readonly sailQueue: Queue,
  ) { }

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

    canEdit = canEdit || user.access.access[UserAccessFields.EditSail] === true;

    if (!canEdit) {
      throw new UnauthorizedException('not authorized to edit sails.');
    }

    await SailEntity.update(sail_id, sail_data);

    const job: SailUpdateJob = {
      message: '',
      sail_id,
    };

    this.sailQueue.add('update-sail', job);

    return SailEntity.findOne({ where: { id: sail_id } });
  }

  @Get('/available')
  async availableSails(@User() user: JwtObject ) {
    const futureSails = await SailEntity.find({
      relations: ['checklists'],
      where: {
        status: SailStatus.New,
        start_at: MoreThanOrEqual(new Date()),
      },
      order: { start_at: 'ASC' }
    });

    return futureSails
      .filter(sail => !sail.manifest.some(sailor => sailor.profile_id === user.profile_id))
      .filter(sail => sail.manifest.length < sail.max_occupancy);
  }

  @Get('/download')
  @UserAccess(UserAccessFields.DownloadSails)
  async download(@Query() query, @Res() response) {
    const sails = await this.findSails(query);

    const fields = [
      '#',
      'name',
      'description',
      'boat',
      'start',
      'end',
      'sailors',
      'guests',
      'status',
    ];

    const opts = { fields };

    const data = sails.map(sail => ({
      '#': sail.entity_number,
      name: sail.name,
      description: sail.description,
      boat: sail.boat.name,
      start: sail.start_at,
      end:sail.end_at,
      sailors: sail
        .manifest
        .filter(manifest => !manifest.guest_of_id)
        .map(manifest => `${manifest.person_name}(${manifest.sailor_role})`),
      guests: sail
        .manifest
        .filter(manifest => !!manifest.guest_of_id)
        .map(manifest => `${manifest.person_name}(${manifest.guest_of.name})`),
      status: sail.status,
    }));

    const parser = new Parser(opts);
    const csv = parser.parse(data);

    response.header('Content-Type', 'text/csv');

    const date = new Date();

    response
      .attachment(`COMPANY_NAME_SHORT_HEADER-sails-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}-.csv`);
    return response.send(csv);
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
  async createFromSailRequest(@Body() sailInfo: { sail: Partial<Sail>, sail_request_id: string }) {
    const createdSailId = await this.service.repository.manager.transaction(async transactionalEntityManager => {
      const sail_request = await SailRequestEntity
        .findOne(
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
      });

      sail = await transactionalEntityManager.save(sail);

      const result = await transactionalEntityManager
        .update(
          SailRequestEntity,
          { id: sailInfo.sail_request_id },{
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
          sailor_role: SailorRole.Member,
        }));

      await transactionalEntityManager.save(manifest);

      return sail.id;
    } );

    return SailEntity.findOne({ where: { id: createdSailId } });
  }

  private async findSails(query) {
    const sailStatus = query.sailStatus;
    const sailName = query.sailName;
    const boatName = query.boatName;
    const sailorNames = [].concat(query.sailorNames).filter(Boolean);
    const start = query.sailStart;
    const end = query.sailEnd;
    const sort = query.sort;
    const limit = query.limit;

    let searchQuery = SailEntity.getRepository().createQueryBuilder('sail');

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
        .leftJoin('sail.boat', 'boat')
        .andWhere('boat.name ILIKE :boatName', { boatName: `%${boatName}%` });
    }

    if (sailorNames?.length) {
      searchQuery = searchQuery
        .leftJoin('sail.manifest', 'manifest')
        .leftJoin('manifest.profile', 'profile')
        .groupBy('manifest.sail_id, sail.id')
        .having(`COUNT(*) = ${sailorNames.length}`);

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
      searchQuery = searchQuery.addOrderBy(key, order[key]);
    });

    if (limit) {
      searchQuery = searchQuery.limit(limit);
    }

    const foundSails = await searchQuery.select('sail.id').getMany();

    const sail_ids = foundSails.map(sail => sail.id);

    if (sail_ids.length) {
      return SailEntity
        .find({
          order: order,
          relations: ['checklists'],
          where: { id: In(sail_ids) },
        });
    }

    return [];
  }

}
