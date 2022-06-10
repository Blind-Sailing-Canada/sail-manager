import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';

import { SailRequestEmail } from '../email/sail-request.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { SailRequestInterestEntity } from './sail-request-interest.entity';
import { BaseQueueProcessor } from '../utils/base-queue-processor';
import { SailRequestInterestNewJob } from '../types/sail-request-interest/sail-request-interest-new-job';

@Processor('sail-request-interest')
export class SailRequestInterestProcessor extends BaseQueueProcessor {

  constructor(
    private sail_requestEmail: SailRequestEmail,
    private emailService: GoogleEmailService
  ) {
    super();
  }

  @Process('new-sail-request-interest')
  async sendInterestRequest(job: Job<SailRequestInterestNewJob>) {
    const sail_requestInterest = await SailRequestInterestEntity.findOne({
      where: { id: job.data.sail_request_interest_id },
      relations: ['sail_request'],
    });

    const email = await this.sail_requestEmail.newInterestSailRequest(sail_requestInterest);

    await this.emailService.sendBccEmail(email);
  }
}
