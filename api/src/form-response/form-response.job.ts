import { Injectable } from '@nestjs/common';
import {
  Cron, CronExpression
} from '@nestjs/schedule';
import { ProfileEntity } from '../profile/profile.entity';
import { FormResponseEntity } from './form-response.entity';

@Injectable()
export class FormResponseJob {

  @Cron(CronExpression.EVERY_HOUR)
  async linkToProfiles() {

    const withoutProfiles = await FormResponseEntity.find({ where: { profile_id: null } });

    for(const needProfile of withoutProfiles) {
      const profile = await ProfileEntity.findOne({ where: { email: needProfile.email } });

      if (profile) {
        await FormResponseEntity.update({ id: needProfile.id }, { profile_id: profile.id });
      }
    }
  }

}
