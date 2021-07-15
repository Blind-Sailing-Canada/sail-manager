import {
  Body,
  Controller, Get, Param, Post, Query, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import {
  In, Like, Not
} from 'typeorm';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { ProfileEntity } from '../profile/profile.entity';
import { SailEntity } from '../sail/sail.entity';
import { ProfileStatus } from '../types/profile/profile-status';
import { SailManifest } from '../types/sail-manifest/sail-manifest';
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

  @Post('/update-sail-manifest/:sailId')
  async updateSailManifest(@Param('sailId') sailId: string, @Body() manifests: Partial<SailManifest>[]) {
    const sail = await SailEntity.findOne(sailId);

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

    return SailEntity.findOne(sailId);
  }

  @Get('/available-sailors')
  async getAvailableSailors(@Query('start') start: string, @Query('end') end: string, @Query('sailorName') sailorName, @Query('limit') limit = 5 ) {
    const sailsDuringThisTime = await SailEntity
      .find(
        {
          relations: ['manifest'],
          where: `
            (start <= "${start}" AND end >= "${start}") OR
            (start <= "${end}" AND end >= "${end}")
          `,
        }
      );

    const notAvailable = sailsDuringThisTime.reduce((red, sail) => {
      return red.concat(sail.manifest.map(manifest => manifest.profileId));
    }, []).filter(Boolean);

    let availableSailors;

    if (sailorName) {
      availableSailors = await ProfileEntity
        .find(
          {
            take: limit,
            where: {
              status: ProfileStatus.Approved,
              id: Not(In(notAvailable)),
              name: Like(`%${sailorName}%`),
            },
          });
    } else {
      availableSailors = await ProfileEntity
        .find({
          take: limit,
          where: {
            status: ProfileStatus.Approved,
            id: Not(In(notAvailable)),
          },
        });
    }

    return availableSailors;
  }
}
