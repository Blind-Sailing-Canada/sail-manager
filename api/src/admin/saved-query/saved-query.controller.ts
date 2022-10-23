import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApprovedUserGuard } from '../../guards/approved-profile.guard';
import { JwtGuard } from '../../guards/jwt.guard';
import { LoginGuard } from '../../guards/login.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { UserRoles } from '../../guards/user-roles.decorator';
import { ProfileRole } from '../../types/profile/profile-role';
import { Parser } from 'json2csv';
import { Crud } from '@nestjsx/crud';
import { SavedQueryEntity } from './saved-query.entity';
import { SavedQueryService } from './saved-query.service';

@Crud({
  model: { type: SavedQueryEntity },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: {
    exclude: ['id'], // https://github.com/nestjsx/crud/issues/788
    alwaysPaginate: true,
    join: { created_by: { eager: true } }
  },
})
@Controller('saved-query')
@ApiTags('saved-query')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
@UserRoles(ProfileRole.Admin)
export class SavedQueryController {
  constructor(public service: SavedQueryService) { }

  private runQuery(query: string) {
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

  @Post('/query')
  query(@Body() body: { query: string }) {
    const query = body.query?.trim() || '';

    return this.runQuery(query);
  }

  @Post('/query/download')
  async download(@Body() body: { query: string }, @Res() response) {
    const query = body.query?.trim() || '';

    const results = await this.runQuery(query);

    const fields = Object.keys(results[0]);

    const opts = { fields };

    const parser = new Parser(opts);
    const csv = parser.parse(results);

    response.header('Content-Type', 'text/csv');

    const date = new Date();

    response
      .attachment(`COMPANY_NAME_SHORT_HEADER-query-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.csv`);
    return response.send(csv);
  }
}
