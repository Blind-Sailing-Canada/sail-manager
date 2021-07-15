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
import { JwtObject } from '../types/token/jwt-object';
import { User } from '../user/user.decorator';
import { SailRequestInterestEntity } from './sail-request-interest.entity';
import { SailRequestInterestService } from './sail-request-interest.service';

@Controller('sail-request-interest')
@ApiTags('sail-request-interest')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class SailRequestInterestController {
  constructor(public service: SailRequestInterestService,
    @InjectQueue('sail-request-interest') private readonly sailRequestInterestQueue: Queue) { }

  @Post(':sailRequestId')
  async interested(@User() user: JwtObject, @Param('sailRequestId') sailRequestId: string) {

    const newInterest = await SailRequestInterestEntity
      .create({
        sailRequestId,
        profileId: user.profileId,
        reload: true,
      })
      .save();

    this.sailRequestInterestQueue.add('new-sail-request-interest', { sailRequestInterestId: newInterest.id });

    return SailRequestEntity
      .findOne(sailRequestId, { relations: [
        'interest',
        'requestedBy',
        'sail',
      ] });
  }

  @Delete(':sailRequestId')
  async uninterested(@User() user: JwtObject, @Param('sailRequestId') sailRequestId: string) {
    await SailRequestInterestEntity.delete({
      sailRequestId,
      profileId: user.profileId,
    });

    return SailRequestEntity.findOne(sailRequestId, { relations: [
      'interest',
      'requestedBy',
      'sail',
    ] });
  }
}
