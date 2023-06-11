import { InjectQueue } from '@nestjs/bull';
import {
  Body, Controller, Logger, Param, Patch, UnauthorizedException, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Queue } from 'bull';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { SailManifestEntity } from '../sail-manifest/sail-manifest.entity';
import { SailEntity } from '../sail/sail.entity';
import { ProfileRole } from '../types/profile/profile-role';
import { SailChecklistUpdateJob } from '../types/sail-checklist/sail-checklist-update-job';
import { SailorRole } from '../types/sail-manifest/sailor-role';
import { JwtObject } from '../types/token/jwt-object';
import { User } from '../user/user.decorator';
import { SailChecklistEntity } from './sail-checklist.entity';
import { SailChecklistService } from './sail-checklist.service';

@Crud({
  model: { type: SailChecklistEntity },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: {
    alwaysPaginate: true,
    exclude: ['id'], // https://github.com/nestjsx/crud/issues/788
    join: {
      submitted_by: { eager: true },
      sail: { eager: true },
      'sail.boat': { eager: true },
    },
  },
  routes: { only: [
    'getOneBase',
    'getManyBase',
  ] },
})
@Controller('checklist')
@ApiTags('checklist')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class SailChecklistController {
  private readonly logger = new Logger(SailChecklistController.name);

  constructor(
    public service: SailChecklistService,
    @InjectQueue('sail-checklist') private readonly sailChecklistQueue: Queue) { }

  private async queueSailChecklistUpdateJob(checklist_id: string) {
    try {
      const job: SailChecklistUpdateJob = { sail_checklist_id: checklist_id, };
      const jobId = `sail-checklist-${checklist_id}`;

      await this.sailChecklistQueue.removeJobs(jobId); // remove old job to prevent spamming
      await this.sailChecklistQueue.add('sail-checklist-update', job, {
        jobId: jobId,
        delay: 1000 * 60 * 60 // 1 hour delay due to form auto save to prevent spamming the emails
      });
    } catch(error) {
      this.logger.error(error); // don't care if queue fails
    }
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

      await this.queueSailChecklistUpdateJob(before.id);

      await SailChecklistEntity.update({
        id: before.id,
        submitted_by_id: null,
      }, { submitted_by_id: user.profile_id });
    }

    const after = checklistInfo.after;

    if (after) {
      await SailChecklistEntity.update(after.id, after);

      await this.queueSailChecklistUpdateJob(after.id);

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
