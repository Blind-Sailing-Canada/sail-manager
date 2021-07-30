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
    private sail_requestEmail: SailRequestEmail,
    private emailService: GoogleEmailService
  ) {
    super();
  }

  @Process('new-sail-request-interest')
  async sendInterestRequest(job: Job) {
    const sail_requestInterest = await SailRequestInterestEntity.findOneOrFail(job.data.sail_requestInterestId, { relations: ['sail_request'] });

    const email = await this.sail_requestEmail.newInterestSailRequest(sail_requestInterest);

    await this.emailService.sendBccEmail(email);
  }
}
