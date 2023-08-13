import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';
import { GoogleEmailService } from '../google-api/google-email.service';
import { BaseQueueProcessor } from '../utils/base-queue-processor';
import * as Sentry from '@sentry/node';
import { SailManifestGuestMustSignReleaseFormJob } from '../types/sail-manifest/sail-manifest-guest-must-sign-release-form-job';
import { ReleaseFormEmail } from '../email/release-form.email';
import { SailEntity } from '../sail/sail.entity';

@Processor('guest-release-form')
export class SailManifestGuestRelaseFormProcessor extends BaseQueueProcessor {

  constructor(
    private releaseFormEmail: ReleaseFormEmail,
    private emailService: GoogleEmailService) {
    super();
  }

  @Process('must-sign-form')
  async sendMustSignReleaseFormEmail(job: Job<SailManifestGuestMustSignReleaseFormJob>) {
    try {
      const sail = await SailEntity.findOneOrFail({ where: { id: job.data.sail_id } });
      const email = await this.releaseFormEmail.mustSignReleaseForm(job.data.guest_name, job.data.email, sail);
      await this.emailService.sendToEmail(email);
    } catch (error) {
      this.logger.error(error);
      Sentry.captureException(error);
    }
  }

}
