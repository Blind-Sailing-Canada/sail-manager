import {
  Body,
  Controller, Get, Param, Post, Query, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { ILike } from 'typeorm';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { ProfileEntity } from '../profile/profile.entity';
import { SocialEntity } from '../social/social.entity';
import { ProfileStatus } from '../types/profile/profile-status';
import { SocialManifest } from '../types/social-manifest/social-manifest';
import { SocialManifestEntity } from './social-manifest.entity';
import { SocialManifestService } from './social-manifest.service';

@Crud({
  model: { type: SocialManifestEntity },
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
@Controller('social-manifest')
@ApiTags('social-manifest')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class SocialManifestController {
  constructor(public service: SocialManifestService) { }

  @Post('/update-social-manifest/:social_id')
  async updateSailManifest(@Param('social_id') social_id: string, @Body() manifests: Partial<SocialManifest>[]) {
    const social = await SocialEntity.findOne({ where: { id: social_id } });

    const currentManifestId = social.manifest.map(manifest => manifest.id).filter(Boolean);
    const updatedManifestId = manifests.map(manifest => manifest.id).filter(Boolean);

    const manifestsToDelete = currentManifestId.filter(id => !updatedManifestId.includes(id));

    const manifestEntities = manifests.map((manifest) => {
      if (!manifest.id) {
        delete manifest.id;
      }

      return SocialManifestEntity.create(manifest);
    });

    await SocialManifestEntity.save(manifestEntities);

    if (manifestsToDelete.length) {
      await SocialManifestEntity.getRepository().delete(manifestsToDelete);
    }

    return SocialEntity.findOne({ where: { id: social_id }, });
  }

  @Get('/available-users')
  async getAvailableSailors(@Query('profileName') profileName, @Query('limit') limit = 5) {
    const searchQuery = ProfileEntity.getRepository().createQueryBuilder('profile');

    searchQuery
      .take(limit)
      .where({ status: ProfileStatus.Approved });

    if (profileName) {
      searchQuery.andWhere({ name: ILike(`%${profileName}%`) });
    }

    const availableSailors =  await searchQuery.getMany();

    return availableSailors;
  }

}
