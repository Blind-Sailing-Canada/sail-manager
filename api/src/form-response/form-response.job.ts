import {
  Injectable, Logger
} from '@nestjs/common';
import {
  Cron, CronExpression
} from '@nestjs/schedule';
import {
  ILike, IsNull
} from 'typeorm';
import { ProfileEntity } from '../profile/profile.entity';
import { FormResponseEntity } from './form-response.entity';

@Injectable()
export class FormResponseJob {
  private readonly logger = new Logger(FormResponseJob.name);

  @Cron(CronExpression.EVERY_HOUR)
  async linkToProfiles() {
    this.logger.log('Linking form responses to profiles...');
    const withoutProfiles = await FormResponseEntity.find({ where: { profile_id: IsNull() } });

    for(const needProfile of withoutProfiles) {
      this.logger.log(`Looking up profile ${needProfile.name} ${needProfile.email}`);

      const profile = await ProfileEntity.findOne({ where: [
        { email: ILike(needProfile.email.trim()) },
        { name: ILike(needProfile.name.trim()) }
      ] });

      if (profile) {
        this.logger.log(`Found profile ${profile.id} and linking to form response ${needProfile.id}`);

        await FormResponseEntity.update({ id: needProfile.id }, { profile_id: profile.id });
      }
    }
  }

}
