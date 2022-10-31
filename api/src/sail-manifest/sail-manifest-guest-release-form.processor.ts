import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';
import { GoogleEmailService } from '../google-api/google-email.service';
import { BaseQueueProcessor } from '../utils/base-queue-processor';
import * as Sentry from '@sentry/node';
import { SailManifestGuestMustSignReleaseFormJob } from '../types/sail-manifest/sail-manifest-guest-must-sign-release-form-job';
import { ReleaseFormEmail } from '../email/release-form.email';

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
      const email = await this.releaseFormEmail.mustSignReleaseForm(job.data.email);
      await this.emailService.sendToEmail(email);
    } catch (error) {
      this.logger.error(error);
      Sentry.captureException(error);
    }
  }

}
