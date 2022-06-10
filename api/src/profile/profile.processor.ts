import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';
import { ProfileEmail } from '../email/profile.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { ProfileEntity } from '../profile/profile.entity';
import { ProfileApprovedJob } from '../types/profile/profile-approved-job';
import { ProfileNewJob } from '../types/profile/profile-new-job';
import { BaseQueueProcessor } from '../utils/base-queue-processor';

@Processor('profile')
export class ProfileProcessor extends BaseQueueProcessor {

  constructor(
    private profileEmail: ProfileEmail,
    private emailService: GoogleEmailService
  ) {
    super();
  }

  @Process('new-profile')
  async sendNewProfileEmail(job: Job<ProfileNewJob>) {
    const profile = await ProfileEntity.findOne({ where: { id: job.data.profile_id } });

    if (!profile) {
      return;
    }

    const admins =  await ProfileEntity.admins();

    if (!admins.length) {
      return;
    }

    const emailInfo = this.profileEmail.newProfileEmail(profile);
    emailInfo.bcc = admins.map(admin => admin.email);

    return this.emailService.sendBccEmail(emailInfo);
  }

  @Process('profile-approved')
  async sendProfileApprovedEmail(job: Job<ProfileApprovedJob>) {
    const profile = await ProfileEntity.findOne({ where: { id: job.data.profile_id } });

    const emailInfo = this.profileEmail.approvedProfileEmail(profile);

    return this.emailService.sendToEmail(emailInfo);
  }

}
