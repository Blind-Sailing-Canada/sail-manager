import {
  Controller, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { SomeUserAccessGuard } from '../guards/some-user-access.guard';
import { UserAccessGuard } from '../guards/user-access.guard';
import { UserAccessFields } from '../types/user-access/user-access-fields';
import { UserAccess } from '../user-access/user-access.decorator';
import { BoatEntity } from './boat.entity';
import { BoatService } from './boat.service';

@Crud({
  model: { type: BoatEntity },
  routes: {
    only: [
      'createOneBase',
      'getManyBase',
      'getOneBase',
      'updateOneBase',
    ],
    createOneBase: { decorators: [
      UserAccess(UserAccessFields.CreateBoat),
      UseGuards(UserAccessGuard),
    ] },
    updateOneBase: { decorators: [
      UserAccess(UserAccessFields.CreateBoat, UserAccessFields.EditBoat),
      UseGuards(SomeUserAccessGuard),
    ] },
  },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: {
    alwaysPaginate: false,
    join: {
      checklist: { eager: true },
      instructions: { eager: true },
    },
  },
})
@Controller('boat')
@ApiTags('boat')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class BoatController {
  constructor(public service: BoatService) { }
}
