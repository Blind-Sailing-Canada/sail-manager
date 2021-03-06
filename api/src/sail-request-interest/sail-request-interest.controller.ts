import { InjectQueue } from '@nestjs/bull';
import {
  Controller, Delete, Param, Post, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Queue } from 'bull';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { SailRequestEntity } from '../sail-request/sail-request.entity';
import { SailRequestInterestNewJob } from '../types/sail-request-interest/sail-request-interest-new-job';
import { JwtObject } from '../types/token/jwt-object';
import { User } from '../user/user.decorator';
import { SailRequestInterestEntity } from './sail-request-interest.entity';
import { SailRequestInterestService } from './sail-request-interest.service';

@Controller('sail-request-interest')
@ApiTags('sail-request-interest')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class SailRequestInterestController {
  constructor(
    public service: SailRequestInterestService,
    @InjectQueue('sail-request-interest') private readonly sail_requestInterestQueue: Queue
  ) { }

  @Post(':sail_request_id')
  async interested(@User() user: JwtObject, @Param('sail_request_id') sail_request_id: string) {

    const newInterest = await SailRequestInterestEntity
      .create({
        sail_request_id,
        profile_id: user.profile_id,
        reload: true,
      })
      .save();

    const job: SailRequestInterestNewJob = { sail_request_interest_id: newInterest.id };

    this.sail_requestInterestQueue.add('new-sail-request-interest', job);

    return SailRequestEntity.findOne({ where: { id:sail_request_id } });
  }

  @Delete(':sail_request_id')
  async uninterested(@User() user: JwtObject, @Param('sail_request_id') sail_request_id: string) {
    await SailRequestInterestEntity.delete({
      sail_request_id,
      profile_id: user.profile_id,
    });

    return SailRequestEntity.findOne({ where: { id: sail_request_id } });
  }
}
