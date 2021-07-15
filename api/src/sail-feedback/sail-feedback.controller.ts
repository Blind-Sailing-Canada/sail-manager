import {
  Controller, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { SailFeedbackEntity } from './sail-feedback.entity';
import { SailFeedbackService } from './sail-feedback.service';

@Crud({
  model: { type: SailFeedbackEntity },
  routes: { only: [
    'getOneBase',
    'getManyBase',
    'createOneBase',
  ] },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: {
    alwaysPaginate: false,
    join: { sail: { eager: true } },
  },
})
@Controller('sail-feedback')
@ApiTags('sail-feedback')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class SailFeedbackController {
  constructor(public service: SailFeedbackService) { }
}
