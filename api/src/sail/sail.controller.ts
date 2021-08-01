import {
  Body,
  Controller,  Get,  Post,  Query, Res, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import {
  getManager, In, MoreThanOrEqual, Not
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

@Crud({
  model: { type: SailEntity },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: {
    alwaysPaginate: false,
    join: {
      boat: { eager: true },
      'boat.instructions': { eager: true },
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
    'getManyBase',
    'getOneBase',
    'updateOneBase',
  ] },
})
@Controller('sail')
@ApiTags('sail')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class SailController {

  constructor(public service: SailService) { }

  @Get('/available')
  async availableSails(@User() user: JwtObject ) {
    const futureSails = await SailEntity.find({ where: {
      status: SailStatus.New,
      start_at: MoreThanOrEqual(new Date()),
    } });

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

    response.attachment(`COMPANY_NAME_SHORT_HEADER-sails-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}-.csv`);
    return response.send(csv);
  }

  @Get('/')
  search(@Query() query) {
    return this.findSails(query);
  }

  @Get('available-boats')
  async availableBoats(@Query() times: {start: string, end: string}) {
    const sailsDuringThisTime = await SailEntity
      .find(
        { where: `
          (start_at <= '${times.start}'::timestamp with time zone AND end_at >= '${times.start}'::timestamp with time zone) OR
          (start_at <= '${times.end}'::timestamp with time zone AND end_at >= '${times.end}'::timestamp with time zone)
          ` }
      );

    const boat_idsInUse = sailsDuringThisTime.map(sail => sail.boat_id);

    if (boat_idsInUse.length) {
      return BoatEntity.find({ where: { id: Not(In(boat_idsInUse)) } });
    } else {
      return BoatEntity.find();
    }
  }

  @Post('/sail-request')
  async createFromSailRequest(@Body() sailInfo: {sail: Partial<Sail>, sail_request_id: string}) {
    const createdSailId = await getManager()
      .transaction(async transactionalEntityManager => {
        const sail_request = await SailRequestEntity
          .findOne(
            sailInfo.sail_request_id,
            { relations: [
              'requested_by',
              'interest',
              'interest.profile',
            ] });

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

    return SailEntity.findOne(createdSailId);
  }

  private async findSails(query) {
    const sailStatus = query.sailStatus;
    const sailName = query.sailName;
    const boatName = query.boatName;
    const sailorNames = [].concat(query.sailorNames).filter(Boolean);
    const start = query.start;
    const end = query.end;

    let searchQuery = SailEntity.getRepository().createQueryBuilder('sail');

    if (sailStatus) {
      searchQuery = searchQuery
        .andWhere(`sail.sailStatus='${sailName}'`);
    }

    if (sailName) {
      searchQuery = searchQuery
        .andWhere(`sail.name LIKE '%${sailName}%'`);
    }

    if (start) {
      searchQuery = searchQuery
        .andWhere(`sail.start_at >= '${start}'`);
    }

    if (end) {
      searchQuery = searchQuery
        .andWhere(`sail.end_at <= '${end}'`);
    }

    if (boatName) {
      searchQuery = searchQuery
        .leftJoin('sail.boat', 'boat')
        .andWhere(`boat.name LIKE '${boatName}%'`);
    }

    if (sailorNames?.length) {
      searchQuery = searchQuery
        .leftJoin('sail.manifest', 'manifest')
        .leftJoin('manifest.profile', 'profile')
        .groupBy('manifest.sail_id, sail.id')
        .having(`COUNT(*) = ${sailorNames.length}`);

      const sailorSearchQuery = sailorNames
        .map(sailorName => `manifest.person_name LIKE '${sailorName}%' OR profile.name LIKE '${sailorName}%'`)
        .join(' OR ');

      searchQuery = searchQuery
        .andWhere(`(${sailorSearchQuery})`);
    }

    const foundSails = await searchQuery.select('sail.id').getMany();

    const sail_ids = foundSails.map(sail => sail.id);

    if (sail_ids.length) {
      return SailEntity
        .find({
          where: { id: In(sail_ids) },
          order: { end_at: 'DESC' },
        });
    }

    return [];
  }

}
