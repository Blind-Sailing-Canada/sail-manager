import {
  Body, Controller, Param, Patch, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { SailManifestEntity } from '../sail-manifest/sail-manifest.entity';
import { SailEntity } from '../sail/sail.entity';
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
    alwaysPaginate: false,
    join: {
      sail: { eager: true },
      'sail.boat': {
        eager: true,
        alias: 'boat',
      },
      'sail.boat.instructions': { eager: true },
      'sail.checklists': { eager: true },
      'sail.manifest': {
        eager: true,
        alias: 'manifest',
      },
      'sail.manifest.profile': { eager: true },
      'sail.manifest.guest_of': { eager: true },
    },
  },
})
@Controller('checklist')
@ApiTags('checklist')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class SailChecklistController {
  constructor(public service: SailChecklistService) { }

  @Patch('/sail/:sail_id/update')
  async updateSailChecklist(@User() user: JwtObject, @Param('sail_id') sail_id: string, @Body() checklistInfo) {
    const before = checklistInfo.before;

    if (before) {
      await SailChecklistEntity.update(before.id, before);
      await SailChecklistEntity.update({
        id: before.id,
        submitted_by_id: null,
      }, { submitted_by_id: user.profile_id });
    }

    const after = checklistInfo.before;

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

    return SailEntity.findOne(sail_id);
  }
}
