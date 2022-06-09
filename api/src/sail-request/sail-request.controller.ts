import {
  Controller, Get, Res, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { SailRequestEntity } from './sail-request.entity';
import { SailRequestService } from './sail-request.service';
import { Parser } from 'json2csv';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';

@Crud({
  model: { type: SailRequestEntity },
  routes: { only: [
    'createOneBase',
    'getManyBase',
    'getOneBase',
    'updateOneBase',
  ] },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: {
    alwaysPaginate: false,
    exclude: ['id'], // https://github.com/nestjsx/crud/issues/788
    join: {
      sail: { eager: true },
      'sail.boat': { eager: true },
      'sail.manifest': { eager: true },
      requested_by: { eager: true } ,
      interest: { eager: true },
      'interest.profile': { eager: true },
    },
  },
})
@Controller('sail-request')
@ApiTags('sail-request')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class SailRequestController {
  constructor(public service: SailRequestService) { }

  @Get('/download')
  async download(@Res() response) {
    const requests = await SailRequestEntity.find({
      order: { created_at: 'DESC' },
      take: 20,
    });

    const fields = [
      '#',
      'details',
      'sail #',
      'requested on',
      'requested by',
      'status',
    ];

    const opts = { fields };

    const data = requests.map(request => ({
      '#': request.id,
      details: request.details,
      'sail #': request.sail_id || '',
      'requested on': request.created_at,
      'requested by': request.requested_by?.name,
      status: request.status,
    }));

    const parser = new Parser(opts);
    const csv = parser.parse(data);

    response.header('Content-Type', 'text/csv');

    const date = new Date();

    response.attachment(`COMPANY_NAME_SHORT_HEADER-sail-requests-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}-.csv`);
    return response.send(csv);
  }
}
