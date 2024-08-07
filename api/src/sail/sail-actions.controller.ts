import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Queue } from 'bull';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { ProfileEntity } from '../profile/profile.entity';
import { RequiredActionEntity } from '../required-action/required-action.entity';
import { SailChecklistEntity } from '../sail-checklist/sail-checklist.entity';
import { SailManifestEntity } from '../sail-manifest/sail-manifest.entity';
import { SailPaymentClaimEntity } from '../sail-payment-claim/sail-payment-claim.entity';
import { SailPaymentClaimService } from '../sail-payment-claim/sail-payment-claim.service';
import { ProfileRole } from '../types/profile/profile-role';
import { RequiredActionStatus } from '../types/required-action/required-action-status';
import { RequiredActionType } from '../types/required-action/required-action-type';
import { SailChecklistType } from '../types/sail-checklist/sail-checklist-type';
import { SailorRole } from '../types/sail-manifest/sailor-role';
import { CancelRequest } from '../types/sail/cancel-request';
import { SailCancelJob } from '../types/sail/sail-cancel-job';
import { SailJoinJob } from '../types/sail/sail-join-job';
import { SailLeaveJob } from '../types/sail/sail-leave-job';
import { SailNewJob } from '../types/sail/sail-new-job';
import { SailStatus } from '../types/sail/sail-status';
import { SailUpdateJob } from '../types/sail/sail-update-job';
import { JwtObject } from '../types/token/jwt-object';
import { UserAccessFields } from '../types/user-access/user-access-fields';
import { User } from '../user/user.decorator';
import { SailEntity } from './sail.entity';
import { SailService } from './sail.service';
import { SettingEntity } from '../setting/setting.entity';
import { In } from 'typeorm';
import {
  RateSailSubscription, RateSailSubscriptionSetting
} from '../types/settings/rate-sail-subscription';

@Controller('sail')
@ApiTags('sail')
@UseGuards(JwtGuard, LoginGuard)
export class SailActionsController {
  private logger: Logger;

  constructor(
    private service: SailService,
    @InjectQueue('sail') private readonly sailQueue: Queue,
    private sailClaimService: SailPaymentClaimService,
  )
  {
    this.logger = new Logger(SailActionsController.name);
  }

  @Post('/:sail_id/new-sail-notification')
  sendNewSailEmail(@Param('sail_id') sail_id: string, @Body('message') message: string) {
    const job: SailNewJob = {
      message,
      sail_id,
    };

    this.sailQueue.add('new-sail', job);
  }

  @Post('/:sail_id/update-sail-notification')
  sendUpdateSailEmail(@Param('sail_id') sail_id: string, @Body('message') message: string) {
    const job: SailUpdateJob = {
      message,
      sail_id,
    };

    this.sailQueue.add('update-sail', job);
  }

  @Put(':id/join/skipper')
  async joinSailAsSkipper(@User() user: JwtObject, @Param('id') id: string) {
    const profile = await ProfileEntity.findOne({ where: { id: user.profile_id } });

    if (!profile.roles.includes(ProfileRole.Skipper)) {
      throw new UnauthorizedException('You do not have skipper status');
    }

    const sail = await SailEntity.findOne({ where: { id } });

    if (!sail) {
      throw new NotFoundException(`Cannot find sail with id = ${id}`);
    }

    if (sail.is_private && sail.created_by_id !== user.profile_id) {
      throw new UnauthorizedException('This sail is private.');
    }

    if (sail.manifest.find(sailor => sailor.sailor_role == SailorRole.Skipper)) {
      throw new BadRequestException('This sail already has a skipper.');
    }

    const sailorProfile = await ProfileEntity.findOneOrFail({ where: { id: user.profile_id } });

    await this.service.repository.manager.transaction(async transactionalEntityManager => {
      const sailor = new SailManifestEntity();

      sailor.person_name = sailorProfile.name;
      sailor.profile_id = user.profile_id;
      sailor.sail_id = sail.id;
      sailor.sailor_role = SailorRole.Skipper;

      await transactionalEntityManager.save(sailor);

      sail.manifest.push(sailor);

      await transactionalEntityManager.save(sail);

      const job: SailJoinJob = {
        profile_id: user.profile_id,
        sail_id: sail.id,
      };

      this.sailQueue.add('join-sail', job);
    });

    return this.service.getFullyResolvedSail(id);
  }

  @Put(':id/join/crew')
  async joinSailAsCrew(@User() user: JwtObject, @Param('id') id: string) {
    const profile = await ProfileEntity.findOne({ where: { id: user.profile_id } });

    if (!profile.roles.includes(ProfileRole.Crew)) {
      throw new UnauthorizedException('You do not have crew status');
    }

    const sail = await SailEntity.findOne({ where: { id } });

    if (!sail) {
      throw new NotFoundException(`Cannot find sail with id = ${id}`);
    }

    if (sail.is_private && sail.created_by_id !== user.profile_id) {
      throw new UnauthorizedException('This sail is private.');
    }

    if (sail.manifest.find(sailor => sailor.sailor_role == SailorRole.Crew)) {
      throw new BadRequestException('This sail already has a crew.');
    }

    const sailorProfile = await ProfileEntity.findOneOrFail({ where: { id: user.profile_id } });

    await this.service.repository.manager.transaction(async transactionalEntityManager => {
      const sailor = new SailManifestEntity();

      sailor.person_name = sailorProfile.name;
      sailor.profile_id = user.profile_id;
      sailor.sail_id = sail.id;
      sailor.sailor_role = SailorRole.Crew;

      await transactionalEntityManager.save(sailor);

      sail.manifest.push(sailor);

      await transactionalEntityManager.save(sail);

      const job: SailJoinJob = {
        profile_id: user.profile_id,
        sail_id: sail.id,
      };

      this.sailQueue.add('join-sail', job);
    });

    return this.service.getFullyResolvedSail(id);
  }

  @Put(':id/join/sailor')
  async joinSailAsSailor(@User() user: JwtObject, @Param('id') id: string) {
    const sail = await SailEntity.findOne({ where: { id } });

    if (!sail) {
      throw new NotFoundException(`Cannot find sail with id = ${id}`);
    }

    if (sail.is_private && sail.created_by_id !== user.profile_id) {
      throw new UnauthorizedException('This sail is private.');
    }

    const skipperAndCrewCount = sail.manifest?.filter(sailor => [
      SailorRole.Skipper,
      SailorRole.Crew
    ].includes(sailor.sailor_role)).length || 0;
    const reservedSpots = skipperAndCrewCount > 2 ? skipperAndCrewCount : 2;

    // at least 2 spots reserved for 1 skipper + 1 crew
    if (sail.max_occupancy - reservedSpots <= sail.manifest.length - skipperAndCrewCount) {
      throw new BadRequestException('Sail is full.');
    }

    const sailorProfile = await ProfileEntity.findOneOrFail({ where: { id: user.profile_id } });

    await this.service.repository.manager.transaction(async transactionalEntityManager => {
      const sailor = new SailManifestEntity();

      sailor.person_name = sailorProfile.name;
      sailor.profile_id = user.profile_id;
      sailor.sail_id = sail.id;
      sailor.sailor_role = sailorProfile.roles.includes(ProfileRole.Member) ? SailorRole.Member : SailorRole.Sailor;

      await transactionalEntityManager.save(sailor);

      sail.manifest.push(sailor);

      await transactionalEntityManager.save(sail);

      const job: SailJoinJob = {
        profile_id: user.profile_id,
        sail_id: sail.id,
      };

      this.sailQueue.add('join-sail', job);
    });

    return this.service.getFullyResolvedSail(id);
  }

  @Delete(':id/leave')
  async leaveSail(@User() user: JwtObject, @Param('id') id: string) {
    const result = await SailManifestEntity.delete({
      sail_id: id,
      profile_id: user.profile_id,
    });

    if (result.affected != 1) {
      throw new InternalServerErrorException(`Failed to leave sail ${id}`);
    }

    const job: SailLeaveJob = {
      profile_id: user.profile_id,
      sail_id: id,
    };

    this.sailQueue.add('leave-sail', job);

    return this.service.getFullyResolvedSail(id);
  }

  @Patch(':id/start')
  async startSail(@User() user: JwtObject, @Param('id') id: string) {
    await this.service.repository.manager.transaction(async transactionalEntityManager => {
      const sail = await SailEntity.findOneOrFail({ where: { id } });

      const skipperAndCrew = sail
        .manifest
        .filter(sailor => [
          SailorRole.Skipper,
          SailorRole.Crew
        ].includes(sailor.sailor_role));

      let canPerformAction = false;

      canPerformAction = canPerformAction || user.roles.includes(ProfileRole.Admin);
      canPerformAction = canPerformAction || skipperAndCrew.some(sailor => sailor.profile_id === user.profile_id);
      canPerformAction = canPerformAction || user.access[UserAccessFields.EditSail];

      if (!canPerformAction) {
        throw new UnauthorizedException('Not authorized to start sails.');
      }

      const result = await transactionalEntityManager.update(SailEntity, { id }, { status: SailStatus.Started });

      if (result.affected !== 1) {
        throw new NotFoundException(`Cannot find sail with id ${id}`);
      }

      const existingDeparture = (await SailChecklistEntity.find({
        where: {
          sail_id: id,
          checklist_type: SailChecklistType.Before,
        },
        take: 1,
      }))[0];

      if (!existingDeparture) {
        const departure = SailChecklistEntity.create({
          sail_id: id,
          checklist_type: SailChecklistType.Before,
        });

        await transactionalEntityManager.save(departure);
      }

      const existingArrival = (await SailChecklistEntity.find({
        where: {
          sail_id: id,
          checklist_type: SailChecklistType.After,
        },
        take: 1,
      }))[0];

      if (!existingArrival) {
        const arrival = SailChecklistEntity.create({
          sail_id: id,
          checklist_type: SailChecklistType.After,
        });

        await transactionalEntityManager.save(arrival);
      }

    });

    return this.service.getFullyResolvedSail(id);
  }

  @Patch(':id/complete')
  async finishSail(@User() user: JwtObject, @Param('id') id: string) {
    await this.service.repository.manager.transaction(async transactionalEntityManager => {
      const sail = await SailEntity.findOneOrFail({ where: { id } });

      const skipperAndCrew = sail
        .manifest
        .filter(sailor => sailor.sailor_role === SailorRole.Skipper || sailor.sailor_role === SailorRole.Crew);

      let canPerformAction = false;

      canPerformAction = canPerformAction || user.roles.includes(ProfileRole.Admin);
      canPerformAction = canPerformAction || skipperAndCrew.some(sailor => sailor.profile_id === user.profile_id);
      canPerformAction = canPerformAction || user.access[UserAccessFields.EditSail];

      if (!canPerformAction) {
        throw new UnauthorizedException('Not authorized to complete sails.');
      }

      sail.status = SailStatus.Completed;

      await transactionalEntityManager.save(sail);

      const due_date = new Date();

      due_date.setDate(due_date.getDate() + 2);

      const sailor_profile_ids = sail.manifest.map(sailor => sailor.profile_id).filter(Boolean);

      const sailor_settings = await SettingEntity
        .find({ where: { profile_id: In(sailor_profile_ids) } });

      const required_actions = sail
        .manifest
        .filter(sailor => !!sailor.profile_id)
        .filter(sailor => {
          const setting = sailor_settings.find(s => s.profile_id == sailor.profile_id);
          if (!setting) {
            return true;
          }
          if (setting?.settings[RateSailSubscriptionSetting] === undefined) {
            return true;
          }
          return setting?.settings[RateSailSubscriptionSetting] === RateSailSubscription.Subscribed;
        })
        .map(sailor => RequiredActionEntity.create({
          due_date,
          actionable_id: id,
          actionable_type: 'SailEntity',
          assigned_to_id: sailor.profile_id,
          details: `Sail date: ${sail.start_at}`,
          required_action_type: RequiredActionType.RateSail,
          status: RequiredActionStatus.New,
          title: `Rate "${sail.name}" sail.`,
        }));

      await transactionalEntityManager.save(required_actions);

      if (sail.is_payment_free) {
        return;
      }

      const sail_payment_claims = sail
        .manifest
        .filter(sailor => ![ // Skippers and Crew don't pay for sails they work on
          SailorRole.Skipper,
          SailorRole.Crew
        ].includes(sailor.sailor_role))
        .map(sailor => SailPaymentClaimEntity.create({
          profile_id: sailor.guest_of_id ?? sailor.profile_id,
          guest_email: sailor.guest_email,
          guest_name: sailor.guest_of_id ? sailor.person_name : null,
          sail_id: sail.id,
          product_purchase_id: null,
        }));

      await transactionalEntityManager.save(sail_payment_claims);

    });

    await this.sailClaimService
      .linkAllClaimsToProfile()
      .catch((error) => {
        this.logger.error(error);
      });

    return this.service.getFullyResolvedSail(id);
  }

  @Patch(':id/cancel')
  async cancelSail(@User() user: JwtObject, @Param('id') id: string, @Body() details: CancelRequest) {
    const sail = await SailEntity.findOneOrFail({ where: { id } });

    let canPerformAction = false;

    canPerformAction = canPerformAction || user.roles.includes(ProfileRole.Admin);
    canPerformAction = canPerformAction || sail
      .manifest.some(sailor => sailor.sailor_role === SailorRole.Skipper && sailor.profile_id === user.profile_id);
    canPerformAction = canPerformAction || user.access[UserAccessFields.EditSail];

    if (!canPerformAction) {
      throw new UnauthorizedException('Not authorized to cancel sails.');
    }

    if (!details.cancel_reason) {
      throw new BadRequestException('You must provide a reason for cancelling the sail.');
    }

    const result = await SailEntity.update({ id }, {
      status: SailStatus.Cancelled,
      cancel_reason: details.cancel_reason,
      cancelled_by_id: user.profile_id,
      cancelled_at: new Date(),
    });

    if (result.affected != 1) {
      throw new NotFoundException(`Cannot find sail with id = ${id}`);
    }

    const job: SailCancelJob = { sail_id: id };

    this.sailQueue.add('cancel-sail', job);

    return this.service.getFullyResolvedSail(id);
  }

}
