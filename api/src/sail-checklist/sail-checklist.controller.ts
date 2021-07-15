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
      'sail.manifest.guestOf': { eager: true },
    },
  },
})
@Controller('checklist')
@ApiTags('checklist')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class SailChecklistController {
  constructor(public service: SailChecklistService) { }

  @Patch('/sail/:sailId/update')
  async updateSailChecklist(@Param('sailId') sailId: string, @Body() checklistInfo) {
    const before = checklistInfo.before;

    if (before) {
      await SailChecklistEntity.update(before.id, before);
    }

    const after = checklistInfo.before;

    if (after) {
      await SailChecklistEntity.update(after.id, after);
    }

    const manifest = checklistInfo.peopleManifest;

    if (manifest) {
      const manifestEntities = manifest
        .filter(sailor => !!sailor.id)
        .map((sailor) => {
          const entity = new SailManifestEntity();

          entity.id = sailor.id;
          entity.sailId = sailId;
          entity.attended = sailor.attended;

          return entity;
        });

      if (manifestEntities.length) {
        await SailManifestEntity.save(manifestEntities);
      }
    }

    return SailEntity.findOne(sailId);
  }
}
