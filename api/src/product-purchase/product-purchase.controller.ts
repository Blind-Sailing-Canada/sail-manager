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
import { ProductPurchaseEntity } from './product-purchase.entity';
import { ProductPurchaseService } from './product-purchase.service';

@Crud({
  model: { type: ProductPurchaseEntity },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: {
    exclude: ['id'], // https://github.com/nestjsx/crud/issues/788
    alwaysPaginate: true,
    join: { profile: { eager: true } }
  },
  routes: { only: [
    'getOneBase',
    'getManyBase'
  ], },
})
@Controller('product-purchase')
@ApiTags('product-purchase')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard, RolesGuard)
export class ProductPurchaseController implements CrudController<ProductPurchaseEntity>{
  constructor(public service: ProductPurchaseService) {}

  get base(): CrudController<ProductPurchaseEntity> {
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
