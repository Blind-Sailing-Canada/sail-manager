import {
  Body, Controller, Get, Param, Patch, Query, UnauthorizedException, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Not } from 'typeorm';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { SailManifestEntity } from '../sail-manifest/sail-manifest.entity';
import { SailEntity } from '../sail/sail.entity';
import { ProfileRole } from '../types/profile/profile-role';
import { SailorRole } from '../types/sail-manifest/sailor-role';
import { JwtObject } from '../types/token/jwt-object';
import { User } from '../user/user.decorator';
import { SailChecklistEntity } from './sail-checklist.entity';
import { SailChecklistService } from './sail-checklist.service';

@Controller('checklist')
@ApiTags('checklist')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class SailChecklistController {
  constructor(public service: SailChecklistService) { }

  @Get('/')
  async fetchChecklists(@Query('boat_id') boat_id: string, @Query('exclude_sail_id') exclude_sail_id: string) {

    const where = {} as any;

    if (boat_id) {
      where.sail = { boat_id };
    }

    if (exclude_sail_id) {
      where.sail_id = Not(exclude_sail_id);
    }

    const checklists = await SailChecklistEntity.find({
      order: { created_at: 'DESC' },
      relations: ['sail'],
      where,
    });

    return checklists;
  }

  @Get('/:checklist_id')
  async fetchChecklist(@Param('checklist_id') checklist_id: string) {
    return SailChecklistEntity.findOne({
      where: { id: checklist_id } ,
      relations: ['sail'],
    });
  }

  @Patch('/sail/:sail_id/update')
  async updateSailChecklist(@User() user: JwtObject, @Param('sail_id') sail_id: string, @Body() checklistInfo) {
    const before = checklistInfo.before;

    const sail = await SailEntity.findOne({ where: { id: sail_id } });

    const allowedToUpdate = user.roles.some(role => role === ProfileRole.Coordinator || role === ProfileRole.Admin)
      || sail.manifest
        .some(
          (sailor) => sailor.profile_id === user.profile_id
            && [
              SailorRole.Skipper,
              SailorRole.Crew,
            ].includes(sailor.sailor_role)
        );

    if (!allowedToUpdate) {
      throw new UnauthorizedException('You are not allowed to update this checklist.');
    }

    if (before) {
      await SailChecklistEntity.update(before.id, before);
      await SailChecklistEntity.update({
        id: before.id,
        submitted_by_id: null,
      }, { submitted_by_id: user.profile_id });
    }

    const after = checklistInfo.after;

    if (after) {
      await SailChecklistEntity.update(after.id, after);
      await SailChecklistEntity.update({
        id: after.id,
        submitted_by_id: null,
      }, { submitted_by_id: user.profile_id });
    }

    const manifest = checklistInfo.peopleManifest;

    if (manifest) {
      const manifestEntities = manifest
        .filter(sailor => !!sailor.id)
        .map((sailor) => {
          const entity = new SailManifestEntity();

          entity.id = sailor.id;
          entity.sail_id = sail_id;
          entity.attended = sailor.attended;

          return entity;
        });

      if (manifestEntities.length) {
        await SailManifestEntity.save(manifestEntities);
      }
    }

    return SailEntity.findOne({
      where: { id: sail_id },
      relations: ['checklists'],
    });
  }
}
