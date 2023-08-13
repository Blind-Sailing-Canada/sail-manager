import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  Controller, Get, Logger, Param, Post, Query, UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Queue } from 'bull';
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
import { SailUpdateJob } from '../types/sail/sail-update-job';
import { SailManifestEntity } from './sail-manifest.entity';
import { SailManifestService } from './sail-manifest.service';
import * as Sentry from '@sentry/node';
import { SailManifestGuestMustSignReleaseFormJob } from '../types/sail-manifest/sail-manifest-guest-must-sign-release-form-job';
import { SailService } from '../sail/sail.service';

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
  private readonly logger = new Logger(SailManifestController.name);

  constructor(
    public service: SailManifestService,
    private sailService: SailService,
    @InjectQueue('sail') private readonly sailQueue: Queue,
    @InjectQueue('guest-release-form') private readonly guestReleaseFormQueue: Queue,
  ) { }

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

    const job: SailUpdateJob = {
      message: '',
      sail_id,
    };

    this.sailQueue.add('update-sail', job);

    const newGuestSailors = manifests.filter(manifest => !!manifest.guest_of_id).filter(manifest => !manifest.id);

    for(const guest of newGuestSailors) {
      if (!guest.guest_email) {
        const errorMessage = `guest ${guest.person_name} has no email on sail ${sail.id}`;
        this.logger.error(errorMessage);
        Sentry.captureMessage(errorMessage);
        continue;
      }

      try {
        const releaseFormJob: SailManifestGuestMustSignReleaseFormJob = {
          email: guest.guest_email,
          guest_name: guest.person_name,
          sail_id
        };
        const jobId = `${guest.guest_email}_${guest.person_name}`;
        await this.guestReleaseFormQueue.removeJobs(jobId);
        await this.guestReleaseFormQueue.add('must-sign-form', releaseFormJob, { jobId });
      } catch (error) {
        this.logger.error(`failed to create/remove guest release form job: ${error.message}`, error.stack);
        Sentry.captureException(error);
      }
    }

    return this.sailService.getFullyResolvedSail(sail_id);
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
      searchQuery.andWhere([
        // THIS IS AN OR CONDITION
        { name: ILike(`%${sailorName}%`) },
        { email: ILike(`%${sailorName}%`) }
      ]);
    }

    const availableSailors =  await searchQuery.getMany();

    return availableSailors;
  }
}
