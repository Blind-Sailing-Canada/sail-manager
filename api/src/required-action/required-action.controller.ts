import {
  Controller, Get, UnauthorizedException, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RequiredActionStatus } from '../types/required-action/required-action-status';
import { JwtObject } from '../types/token/jwt-object';
import { User } from '../user/user.decorator';
import { RequiredActionOwnerGuard } from './required-action-owner.guard';
import { RequiredActionEntity } from './required-action.entity';
import { RequiredActionService } from './required-action.service';

@Crud({
  model: { type: RequiredActionEntity },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  routes: {
    only: ['updateOneBase'],
    updateOneBase: { decorators: [UseGuards(RequiredActionOwnerGuard),] },
  }
})
@Controller('required-action')
@ApiTags('required-action')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class RequiredActionController {
  constructor(public service: RequiredActionService) { }

  @Get('/my-required-actions')
  async myRequiredActions(@User() user: JwtObject ) {

    if (!user) {
      throw new UnauthorizedException();
    }

    return RequiredActionEntity.find({
      order: { due_date: 'ASC' },
      where: {
        assigned_to_id: user.profile_id,
        status: RequiredActionStatus.New,
      },
    });
  }
}
