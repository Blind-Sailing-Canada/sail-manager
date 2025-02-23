import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  Controller,
  Delete,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Queue } from 'bull';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { ProfileEntity } from '../profile/profile.entity';
import { SocialManifestEntity } from '../social-manifest/social-manifest.entity';
import { CancelRequest } from '../types/sail/cancel-request';
import { SocialCancelJob } from '../types/social/social-cancel-job';
import { SocialJoinJob } from '../types/social/social-join-job';
import { SocialLeaveJob } from '../types/social/social-leave-job';
import { SocialNewJob } from '../types/social/social-new-job';
import { SocialStatus } from '../types/social/social-status';
import { SocialUpdateJob } from '../types/social/social-update-job';
import { JwtObject } from '../types/token/jwt-object';
import { User } from '../user/user.decorator';
import { SocialEntity } from './social.entity';
import { SocialService } from './social.service';

@Controller('social')
@ApiTags('social')
@UseGuards(JwtGuard, LoginGuard)
export class SocialActionsController {

  constructor(
    private service: SocialService,
    @InjectQueue('social') private readonly socialQueue: Queue) { }

  @Post('/:social_id/new-social-notification')
  sendNewSocialEmail(@Param('social_id') social_id: string, @Body('message') message: string) {
    const job: SocialNewJob = {
      message,
      social_id,
    };

    this.socialQueue.add('new-social', job);
  }

  @Post('/:social_id/update-social-notification')
  sendUpdateSocialEmail(@Param('social_id') social_id: string, @Body('message') message: string) {
    const job: SocialUpdateJob = {
      message,
      social_id,
    };

    this.socialQueue.add('update-social', job);
  }

  @Put(':id/join')
  async joinSocial(@User() user: JwtObject, @Param('id') id: string) {
    const social = await SocialEntity.findOne({ where: { id } });

    if (!social) {
      throw new NotFoundException(`Cannot find social with id = ${id}`);
    }

    const profile = await ProfileEntity.findOneOrFail({ where: { id: user.profile_id } });

    await this.service.repository.manager.transaction(async transactionalEntityManager => {
      const sailor = new SocialManifestEntity();

      sailor.person_name = profile.name;
      sailor.profile_id = user.profile_id;
      sailor.social_id = social.id;

      await transactionalEntityManager.save(sailor);

      social.manifest.push(sailor);

      await transactionalEntityManager.save(social);

      const job: SocialJoinJob = {
        profile_id: user.profile_id,
        social_id: social.id,
      };

      this.socialQueue.add('join-social', job);
    });

    return SocialEntity.findOne({
      where: { id },
      relations: ['manifest'],
    });
  }

  @Delete(':id/leave')
  async leaveSocial(@User() user: JwtObject, @Param('id') id: string) {
    const result = await SocialManifestEntity.delete({
      social_id: id,
      profile_id: user.profile_id,
    });

    if (result.affected != 1) {
      throw new InternalServerErrorException(`Failed to leave social ${id}`);
    }

    const job: SocialLeaveJob = {
      profile_id: user.profile_id,
      social_id: id,
    };

    this.socialQueue.add('leave-social', job);

    return SocialEntity.findOne({
      where: { id },
      relations: ['manifest'],
    });
  }

  @Patch(':id/complete')
  async finishSocial(@User() user: JwtObject, @Param('id') id: string) {
    await SocialEntity.update({ id }, { status: SocialStatus.Completed });
    return SocialEntity.findOne({
      where: { id },
      relations: ['manifest'],
    });
  }

  @Patch(':id/cancel')
  async cancelSocial(@User() user: JwtObject, @Param('id') id: string, @Body() details: CancelRequest) {
    const result = await SocialEntity.update({ id }, {
      status: SocialStatus.Cancelled,
      cancel_reason: details.cancel_reason,
      cancelled_by_id: user.profile_id,
      cancelled_at: new Date(),
    });

    if (result.affected != 1) {
      throw new NotFoundException(`Cannot find social with id = ${id}`);
    }

    const job: SocialCancelJob = { social_id: id };

    this.socialQueue.add('cancel-social', job);

    return SocialEntity.findOne({
      where: { id },
      relations: ['manifest'],
    });
  }

}
