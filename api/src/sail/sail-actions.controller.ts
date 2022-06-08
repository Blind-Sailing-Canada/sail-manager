import { InjectQueue } from '@nestjs/bull';
import {
  BadRequestException,
  Body,
  Controller, Delete, InternalServerErrorException, NotFoundException, Param, Patch,  Post,  Put, UnauthorizedException, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Queue } from 'bull';
import {
  getConnection, getManager
} from 'typeorm';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { ProfileEntity } from '../profile/profile.entity';
import { RequiredActionEntity } from '../required-action/required-action.entity';
import { SailChecklistEntity } from '../sail-checklist/sail-checklist.entity';
import { SailManifestEntity } from '../sail-manifest/sail-manifest.entity';
import { ProfileRole } from '../types/profile/profile-role';
import { RequiredActionStatus } from '../types/required-action/required-action-status';
import { RequiredActionType } from '../types/required-action/required-action-type';
import { SailChecklistType } from '../types/sail-checklist/sail-checklist-type';
import { SailorRole } from '../types/sail-manifest/sailor-role';
import { CancelRequest } from '../types/sail/cancel-request';
import { SailStatus } from '../types/sail/sail-status';
import { JwtObject } from '../types/token/jwt-object';
import { UserAccessFields } from '../types/user-access/user-access-fields';
import { User } from '../user/user.decorator';
import { SailEntity } from './sail.entity';

@Controller('sail')
@ApiTags('sail')
@UseGuards(JwtGuard, LoginGuard)
export class SailActionsController {

  constructor(@InjectQueue('sail') private readonly sailQueue: Queue) {}

  @Post('/:sail_id/new-sail-notification')
  sendNewSailEmail(@Param('sail_id') sail_id: string, @Body('message') message: string) {
    this.sailQueue
      .add('new-sail', {
        message,
        sail_id,
      });
  }

  @Post('/:sail_id/update-sail-notification')
  sendUpdateSailEmail(@Param('sail_id') sail_id: string, @Body('message') message: string) {
    this.sailQueue
      .add('update-sail', {
        message,
        sail_id,
      });
  }

  @Put(':id/join/skipper')
  async joinSailAsSkipper(@User() user: JwtObject, @Param('id') id: string) {
    const profile = await ProfileEntity.findOne(user.profile_id);

    if (!profile.roles.includes(ProfileRole.Skipper)) {
      throw new UnauthorizedException('You do not have skipper status');
    }

    const sail = await SailEntity.findOne(id);

    if (!sail) {
      throw new NotFoundException(`Cannot find sail with id = ${id}`);
    }

    if (sail.manifest.find(sailor => sailor.sailor_role == SailorRole.Skipper)) {
      throw new BadRequestException('This sail already has a skipper.');
    }

    await getManager().transaction(async transactionalEntityManager => {
      const sailor = new SailManifestEntity();

      sailor.person_name = user.username;
      sailor.profile_id = user.profile_id;
      sailor.sail_id = sail.id;
      sailor.sailor_role = SailorRole.Skipper;

      await transactionalEntityManager.save(sailor);

      sail.manifest.push(sailor);

      await transactionalEntityManager.save(sail);

      this.sailQueue
        .add('join-sail', {
          profile_id: user.profile_id,
          sail_id: sail.id,
        });
    });

    return SailEntity.findOne(id, { relations: ['checklists'] });
  }

  @Put(':id/join/crew')
  async joinSailAsCrew(@User() user: JwtObject, @Param('id') id: string) {
    const profile = await ProfileEntity.findOne(user.profile_id);

    if (!profile.roles.includes(ProfileRole.Crew)) {
      throw new UnauthorizedException('You do not have crew status');
    }

    const sail = await SailEntity.findOne(id);

    if (!sail) {
      throw new NotFoundException(`Cannot find sail with id = ${id}`);
    }

    if (sail.max_occupancy <= sail.manifest.length) {
      throw new BadRequestException('Sail is full.');
    }

    await getManager().transaction(async transactionalEntityManager => {
      const sailor = new SailManifestEntity();

      sailor.person_name = user.username;
      sailor.profile_id = user.profile_id;
      sailor.sail_id = sail.id;
      sailor.sailor_role = SailorRole.Crew;

      await transactionalEntityManager.save(sailor);

      sail.manifest.push(sailor);

      await transactionalEntityManager.save(sail);

      this.sailQueue
        .add('join-sail', {
          profile_id: user.profile_id,
          sail_id: sail.id,
        });
    });

    return SailEntity.findOne(id, { relations: ['checklists'] });
  }

  @Put(':id/join/sailor')
  async joinSailAsSailor(@User() user: JwtObject, @Param('id') id: string) {
    const sail = await SailEntity.findOne(id);

    if (!sail) {
      throw new NotFoundException(`Cannot find sail with id = ${id}`);
    }

    // 2 spots reserved for 1 skipper + 1 crew
    if (sail.max_occupancy - 2 <= (sail.manifest.length - 2)) {
      throw new BadRequestException('Sail is full.');
    }

    await getManager().transaction(async transactionalEntityManager => {
      const sailor = new SailManifestEntity();

      sailor.person_name = user.username;
      sailor.profile_id = user.profile_id;
      sailor.sail_id = sail.id;
      sailor.sailor_role = SailorRole.Sailor;

      await transactionalEntityManager.save(sailor);

      sail.manifest.push(sailor);

      await transactionalEntityManager.save(sail);

      this.sailQueue
        .add('join-sail', {
          profile_id: user.profile_id,
          sail_id: sail.id,
        });
    });

    return SailEntity.findOne(id, { relations: ['checklists'] });
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

    this.sailQueue
      .add('leave-sail', {
        profile_id: user.profile_id,
        sail_id: id,
      });

    return SailEntity.findOne(id, { relations: ['checklists'] });
  }

  @Patch(':id/start')
  async startSail(@User() user: JwtObject, @Param('id') id: string) {
    await getConnection().transaction(async transactionalEntityManager => {
      const sail = await SailEntity.findOneOrFail(id);

      const skipperAndCrew = sail.manifest.filter(sailor => sailor.sailor_role === SailorRole.Skipper || sailor.sailor_role === SailorRole.Crew);

      let canPerformAction = false;

      canPerformAction = canPerformAction || user.roles.includes(ProfileRole.Admin);
      canPerformAction = canPerformAction || skipperAndCrew.some(sailor => sailor.profile_id === user.profile_id);
      canPerformAction = canPerformAction || user.access.access[UserAccessFields.EditSail];

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

    return SailEntity.findOne(id, { relations: ['checklists'] });
  }

  @Patch(':id/complete')
  async finishSail(@User() user: JwtObject, @Param('id') id: string) {
    await getConnection()
      .transaction(async transactionalEntityManager => {
        const sail = await SailEntity.findOneOrFail(id);

        const skipperAndCrew = sail.manifest.filter(sailor => sailor.sailor_role === SailorRole.Skipper || sailor.sailor_role === SailorRole.Crew);

        let canPerformAction = false;

        canPerformAction = canPerformAction || user.roles.includes(ProfileRole.Admin);
        canPerformAction = canPerformAction || skipperAndCrew.some(sailor => sailor.profile_id === user.profile_id);
        canPerformAction = canPerformAction || user.access.access[UserAccessFields.EditSail];

        if (!canPerformAction) {
          throw new UnauthorizedException('Not authorized to complete sails.');
        }

        sail.status = SailStatus.Completed;

        await transactionalEntityManager.save(sail);

        const due_date = new Date();

        due_date.setDate(due_date.getDate() + 2);

        const required_actions = sail
          .manifest
          .filter(sailor => !!sailor.profile_id)
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

      });

    return SailEntity.findOne(id, { relations: ['checklists'] });
  }

  @Patch(':id/cancel')
  async cancelSail(@User() user: JwtObject, @Param('id') id: string, @Body() details: CancelRequest) {
    const sail = await SailEntity.findOneOrFail(id);

    let canPerformAction = false;

    canPerformAction = canPerformAction || user.roles.includes(ProfileRole.Admin);
    canPerformAction = canPerformAction || sail.manifest.some(sailor => sailor.sailor_role === SailorRole.Skipper && sailor.profile_id === user.profile_id);
    canPerformAction = canPerformAction || user.access.access[UserAccessFields.EditSail];

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

    this.sailQueue.add('cancel-sail', { sail_id: id });

    return SailEntity.findOne(id, { relations: ['checklists'] });
  }

}
