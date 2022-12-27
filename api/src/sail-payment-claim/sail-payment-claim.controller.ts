import {
  Controller,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  Crud, CrudController, CrudRequest, Override, ParsedRequest
} from '@nestjsx/crud';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { RolesGuard } from '../guards/roles.guard';
import { ProfileRole } from '../types/profile/profile-role';
import { JwtObject } from '../types/token/jwt-object';
import { User } from '../user/user.decorator';
import { SailPaymentClaimEntity } from './sail-payment-claim.entity';
import { SailPaymentClaimService } from './sail-payment-claim.service';

@Crud({
  model: { type: SailPaymentClaimEntity },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: {
    exclude: ['id'], // https://github.com/nestjsx/crud/issues/788
    alwaysPaginate: true,
    join: {
      profile: { eager: true },
      sail: { eager: true },
      product_purchase: { eager: true }
    }
  },
  routes: { only: [
    'getOneBase',
    'getManyBase'
  ], },
})
@Controller('sail-payment-claim')
@ApiTags('sail-payment-claim')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
export class SailPaymentClaimController implements CrudController<SailPaymentClaimEntity>{
  constructor(public service: SailPaymentClaimService) {}

  get base(): CrudController<SailPaymentClaimEntity> {
    return this;
  }

  @Override()
  getMany(@ParsedRequest() req: CrudRequest, @User() user: JwtObject) {
    if (!user.roles.includes(ProfileRole.Admin)){
      req.parsed.search.$and.push({ profile_id: user.profile_id });
    }

    return this.base.getManyBase(req);
  }

  @Override()
  getOne(@ParsedRequest() req: CrudRequest, @User() user: JwtObject) {
    if (!user.roles.includes(ProfileRole.Admin)){
      req.parsed.search.$and.push({ profile_id: user.profile_id });
    }

    return this.base.getOneBase(req);
  }
}
