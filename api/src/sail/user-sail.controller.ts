import {
  Controller,  Get, Param, Query, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  LessThan,
  MoreThan
} from 'typeorm';
import { ApprovedUserGuard } from '../guards/approved-profile.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { LoginGuard } from '../guards/login.guard';
import { SailManifestEntity } from '../sail-manifest/sail-manifest.entity';
import { SailStatus } from '../types/sail/sail-status';
import { SailEntity } from './sail.entity';

@Controller('sail/user')
@ApiTags('sail/user')
@UseGuards(JwtGuard, LoginGuard, ApprovedUserGuard)
export class UserSailController {

  @Get('/:profileId/count')
  async count(@Param('profileId') profileId) {
    return SailManifestEntity
      .count({ where: { profileId } });
  }

  @Get('/in-progress')
  async inProgressSails(@Query('profileId') profileId, @Query('limit') take: 10) {
    const sails = await SailEntity.find({
      take,
      where: { status: SailStatus.Started },
    });

    if (profileId) {
      return sails.filter(sail => sail.manifest.some(manifest => manifest.profileId === profileId));
    }

    return sails;
  }

  @Get('/past')
  async pastSails(@Query('profileId') profileId, @Query('limit') take: 5) {
    if (profileId) {
      const manifests = await SailManifestEntity.find({
        take,
        relations: ['sail'],
        where: { profileId },
      });

      return manifests
        .filter(manifest => new Date(manifest.sail.end).getTime() < Date.now())
        .map(manifest => manifest.sail);
    }

    return SailEntity.find({
      take,
      where: { end: LessThan(new Date()) },
    });
  }

  @Get('/future')
  async futureSails(@Query('profileId') profileId: string, @Query('limit') take: 5) {
    const sails = await SailEntity
      .find(
        {
          take,
          where: {
            status: SailStatus.New,
            start: MoreThan(new Date()),
          },
          order: { start: 'ASC' },
        }
      );

    if (profileId) {
      return sails.filter(sail => sail.manifest.some(manifest => manifest.profileId === profileId));
    }

    return sails;
  }

  @Get('/today')
  async todaySails(@Query('profileId') profileId) {
    const sails = await SailEntity
      .find(
        { where: `
          (DATE_FORMAT(start, "%Y-%m-%d") = CURDATE() OR DATE_FORMAT(end, "%Y-%m-%d") = CURDATE()) OR
          (start < NOW() AND end > NOW())
          ` }
      );

    if (profileId) {
      return sails.filter(sail => sail.manifest.some(manifest => manifest.profileId === profileId));
    }

    return sails;
  }

  @Get('/all')
  async allSails(@Query('profileId') profileId) {
    const manifests = await SailManifestEntity
      .find({
        relations: ['sail'],
        where: { profileId },
      });

    return manifests.map(manifest => manifest.sail);
  }
}
