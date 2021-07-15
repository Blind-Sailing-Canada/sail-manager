import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';

import { SailRequestEmail } from '../email/sail-request.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { SailRequestInterestEntity } from './sail-request-interest.entity';
import { BaseQueueProcessor } from '../utils/base-queue-processor';

@Processor('sail-request-interest')
export class SailRequestInterestProcessor extends BaseQueueProcessor {

  constructor(
    private sailRequestEmail: SailRequestEmail,
    private emailService: GoogleEmailService
  ) {
    super();
  }

  @Process('new-sail-request-interest')
  async sendInterestRequest(job: Job) {
    const sailRequestInterest = await SailRequestInterestEntity.findOneOrFail(job.data.sailRequestInterestId, { relations: ['sailRequest'] });

    const email = await this.sailRequestEmail.newInterestSailRequest(sailRequestInterest);

    await this.emailService.sendBccEmail(email);
  }
}
