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

  @Post('/:sailId/new-sail-notification')
  sendNewSailEmail(@Param('sailId') sailId: string, @Body('message') message: string) {
    this.sailQueue
      .add('new-sail', {
        message,
        sailId,
      });
  }

  @Post('/:sailId/update-sail-notification')
  sendUpdateSailEmail(@Param('sailId') sailId: string, @Body('message') message: string) {
    this.sailQueue
      .add('update-sail', {
        message,
        sailId,
      });
  }

  @Put(':id/join/skipper')
  async joinSailAsSkipper(@User() user: JwtObject, @Param('id') id: string) {
    const profile = await ProfileEntity.findOne(user.profileId);

    if (!profile.roles.includes(ProfileRole.Skipper)) {
      throw new UnauthorizedException('You do not have skipper status');
    }

    const sail = await SailEntity.findOne(id, { relations: ['manifest'] });

    if (!sail) {
      throw new NotFoundException(`Cannot find sail with id = ${id}`);
    }

    if (sail.manifest.find(sailor => sailor.sailorRole == SailorRole.Skipper)) {
      throw new BadRequestException('This sail already has a skipper.');
    }

    await getManager().transaction(async transactionalEntityManager => {
      const sailor = new SailManifestEntity();

      sailor.personName = user.username;
      sailor.profileId = user.profileId;
      sailor.sailId = sail.id;
      sailor.sailorRole = SailorRole.Skipper;

      await transactionalEntityManager.save(sailor);

      sail.manifest.push(sailor);

      await transactionalEntityManager.save(sail);

      this.sailQueue
        .add('join-sail', {
          profileId: user.profileId,
          sailId: sail.id,
        });
    });

    return SailEntity.findOne(id);
  }

  @Put(':id/join/crew')
  async joinSailAsCrew(@User() user: JwtObject, @Param('id') id: string) {
    const profile = await ProfileEntity.findOne(user.profileId);

    if (!profile.roles.includes(ProfileRole.Crew)) {
      throw new UnauthorizedException('You do not have crew status');
    }

    const sail = await SailEntity.findOne(id, { relations: ['manifest'] });

    if (!sail) {
      throw new NotFoundException(`Cannot find sail with id = ${id}`);
    }

    if (sail.maxOccupancy <= sail.manifest.length) {
      throw new BadRequestException('Sail is full.');
    }

    await getManager().transaction(async transactionalEntityManager => {
      const sailor = new SailManifestEntity();

      sailor.personName = user.username;
      sailor.profileId = user.profileId;
      sailor.sailId = sail.id;
      sailor.sailorRole = SailorRole.Crew;

      await transactionalEntityManager.save(sailor);

      sail.manifest.push(sailor);

      await transactionalEntityManager.save(sail);

      this.sailQueue
        .add('join-sail', {
          profileId: user.profileId,
          sailId: sail.id,
        });
    });

    return SailEntity.findOne(id);
  }

  @Put(':id/join/sailor')
  async joinSailAsSailor(@User() user: JwtObject, @Param('id') id: string) {
    const sail = await SailEntity.findOne(id, { relations: ['manifest'] });

    if (!sail) {
      throw new NotFoundException(`Cannot find sail with id = ${id}`);
    }

    // 2 spots reserved for 1 skipper + 1 crew
    if (sail.maxOccupancy - 2 <= (sail.manifest.length - 2)) {
      throw new BadRequestException('Sail is full.');
    }

    await getManager().transaction(async transactionalEntityManager => {
      const sailor = new SailManifestEntity();

      sailor.personName = user.username;
      sailor.profileId = user.profileId;
      sailor.sailId = sail.id;
      sailor.sailorRole = SailorRole.Sailor;

      await transactionalEntityManager.save(sailor);

      sail.manifest.push(sailor);

      await transactionalEntityManager.save(sail);

      this.sailQueue
        .add('join-sail', {
          profileId: user.profileId,
          sailId: sail.id,
        });
    });

    return SailEntity.findOne(id);
  }

  @Delete(':id/leave')
  async leaveSail(@User() user: JwtObject, @Param('id') id: string) {
    const result = await SailManifestEntity.delete({
      sailId: id,
      profileId: user.profileId,
    });

    if (result.affected != 1) {
      throw new InternalServerErrorException(`Failed to leave sail ${id}`);
    }

    this.sailQueue
      .add('leave-sail', {
        profileId: user.profileId,
        sailId: id,
      });

    return SailEntity.findOne(id);
  }

  @Patch(':id/start')
  async startSail(@User() user: JwtObject, @Param('id') id: string) {
    await getConnection().transaction(async transactionalEntityManager => {
      const sail = await SailEntity.findOneOrFail(id);

      const skipperAndCrew = sail.manifest.filter(sailor => sailor.sailorRole === SailorRole.Skipper || sailor.sailorRole === SailorRole.Crew);

      let canPerformAction = false;

      canPerformAction = canPerformAction || user.roles.includes(ProfileRole.Admin);
      canPerformAction = canPerformAction || skipperAndCrew.some(sailor => sailor.profileId === user.profileId);
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
          sailId: id,
          checklistType: SailChecklistType.Before,
        },
        take: 1,
      }))[0];

      if (!existingDeparture) {
        const departure = SailChecklistEntity.create({
          sailId: id,
          checklistType: SailChecklistType.Before,
        });

        await transactionalEntityManager.save(departure);
      }

      const existingArrival = (await SailChecklistEntity.find({
        where: {
          sailId: id,
          checklistType: SailChecklistType.After,
        },
        take: 1,
      }))[0];

      if (!existingArrival) {
        const arrival = SailChecklistEntity.create({
          sailId: id,
          checklistType: SailChecklistType.After,
        });

        await transactionalEntityManager.save(arrival);
      }

    });

    return SailEntity.findOne(id);
  }

  @Patch(':id/complete')
  async finishSail(@User() user: JwtObject, @Param('id') id: string) {
    await getConnection()
      .transaction(async transactionalEntityManager => {
        const sail = await SailEntity.findOneOrFail(id);

        const skipperAndCrew = sail.manifest.filter(sailor => sailor.sailorRole === SailorRole.Skipper || sailor.sailorRole === SailorRole.Crew);

        let canPerformAction = false;

        canPerformAction = canPerformAction || user.roles.includes(ProfileRole.Admin);
        canPerformAction = canPerformAction || skipperAndCrew.some(sailor => sailor.profileId === user.profileId);
        canPerformAction = canPerformAction || user.access.access[UserAccessFields.EditSail];

        if (!canPerformAction) {
          throw new UnauthorizedException('Not authorized to complete sails.');
        }

        sail.status = SailStatus.Completed;

        await transactionalEntityManager.save(sail);

        const dueDate = new Date();

        dueDate.setDate(dueDate.getDate() + 2);

        const requiredActions = sail
          .manifest
          .filter(sailor => !!sailor.profileId)
          .map(sailor => RequiredActionEntity.create({
            dueDate,
            actionableId: id,
            actionableType: 'SailEntity',
            assignedToId: sailor.profileId,
            details: `Sail date: ${sail.start}`,
            requiredActionType: RequiredActionType.RateSail,
            status: RequiredActionStatus.New,
            title: `Rate "${sail.name}" sail.`,
          }));

        await transactionalEntityManager.save(requiredActions);

      });

    return SailEntity.findOne(id);
  }

  @Patch(':id/cancel')
  async cancelSail(@User() user: JwtObject, @Param('id') id: string, @Body() details: CancelRequest) {
    const sail = await SailEntity.findOneOrFail(id);

    let canPerformAction = false;

    canPerformAction = canPerformAction || user.roles.includes(ProfileRole.Admin);
    canPerformAction = canPerformAction || sail.manifest.some(sailor => sailor.sailorRole === SailorRole.Skipper && sailor.profileId === user.profileId);
    canPerformAction = canPerformAction || user.access.access[UserAccessFields.EditSail];

    if (!canPerformAction) {
      throw new UnauthorizedException('Not authorized to cancel sails.');
    }

    if (!details.cancelReason) {
      throw new BadRequestException('You must provide a reason for cancelling the sail.');
    }

    const result = await SailEntity.update({ id }, {
      status: SailStatus.Cancelled,
      cancelReason: details.cancelReason,
      cancelledById: user.profileId,
      cancelledAt: new Date(),
    });

    if (result.affected != 1) {
      throw new NotFoundException(`Cannot find sail with id = ${id}`);
    }

    this.sailQueue.add('cancel-sail', { sailId: id });

    return SailEntity.findOne(id);
  }

}
