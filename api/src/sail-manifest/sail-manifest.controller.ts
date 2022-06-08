import {
  Body,
  Controller, Get, Param, Post, Query, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import {
  ILike,
  In, Not
} from 'typeorm';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { ProfileEntity } from '../profile/profile.entity';
import { SailEntity } from '../sail/sail.entity';
import { ProfileStatus } from '../types/profile/profile-status';
import { SailManifest } from '../types/sail-manifest/sail-manifest';
import { SailStatus } from '../types/sail/sail-status';
import { SailManifestEntity } from './sail-manifest.entity';
import { SailManifestService } from './sail-manifest.service';

@Crud({
  model: { type: SailManifestEntity },
  routes: { only: [
    'getOneBase',
    'getManyBase',
  ] },
  params: { id: {
    field: 'id',
    type: 'uuid',
    primary: true,
  } },
  query: { alwaysPaginate: false },
})
@Controller('sail-manifest')
@ApiTags('sail-manifest')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class SailManifestController {
  constructor(public service: SailManifestService) { }

  @Post('/update-sail-manifest/:sail_id')
  async updateSailManifest(@Param('sail_id') sail_id: string, @Body() manifests: Partial<SailManifest>[]) {
    const sail = await SailEntity.findOne({ where: { id: sail_id } });

    const currentManifestId = sail.manifest.map(manifest => manifest.id).filter(Boolean);
    const updatedManifestId = manifests.map(manifest => manifest.id).filter(Boolean);

    const manifestsToDelete = currentManifestId.filter(id => !updatedManifestId.includes(id));

    const manifestEntities = manifests.map((manifest) => {
      if (!manifest.id) {
        delete manifest.id;
      }

      return SailManifestEntity.create(manifest);
    });

    await SailManifestEntity.save(manifestEntities);

    if (manifestsToDelete.length) {
      await SailManifestEntity.getRepository().delete(manifestsToDelete);
    }

    return SailEntity.findOne({
      where: { id: sail_id },
      relations: ['checklists'],
    });
  }

  @Get('/available-sailors')
  async getAvailableSailors(@Query('start_at') start: string,
    @Query('end_at') end: string,
    @Query('sailorName') sailorName,
    @Query('limit') limit = 5
  ) {
    const sailIdsDuringThisTime = (await SailEntity.getRepository().createQueryBuilder('sail')
      .where(
        `
        status NOT IN ('${SailStatus.Cancelled}', '${SailStatus.Completed}') AND
        ((start_at <= '${start}'::timestamp with time zone AND end_at >= '${start}'::timestamp with time zone) OR
        (start_at <= '${end}'::timestamp with time zone AND end_at >= '${end}'::timestamp with time zone))
        `
      )
      .select('id')
      .getMany()).map(sail => sail.id);

    const sailsDuringThisTime = await SailEntity.find({ where: { id: In(sailIdsDuringThisTime) } });

    const notAvailable = sailsDuringThisTime.reduce((red, sail) => {
      return red.concat(sail.manifest.map(manifest => manifest.profile_id));
    }, []).filter(Boolean);

    const searchQuery = ProfileEntity.getRepository().createQueryBuilder('profile');

    searchQuery
      .take(limit)
      .where({ status: ProfileStatus.Approved });

    if (notAvailable.length) {
      searchQuery
        .andWhere({ id: Not(In(notAvailable)) });
    }

    if (sailorName) {
      searchQuery.andWhere({ name: ILike(`%${sailorName}%`) });
    }

    const availableSailors =  await searchQuery.getMany();

    return availableSailors;
  }
}
