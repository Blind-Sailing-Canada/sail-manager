import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';
import { SailRequestEmail } from '../email/sail-request.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { SailRequestCancelJob } from '../types/sail-request/sail-request-cancel-job';
import { SailRequestNewJob } from '../types/sail-request/sail-request-new-job';
import { BaseQueueProcessor } from '../utils/base-queue-processor';
import { SailRequestEntity } from './sail-request.entity';

@Processor('sail-request')
export class SailRequestProcessor extends BaseQueueProcessor {

  constructor(
    private sail_requestEmail: SailRequestEmail,
    private emailService: GoogleEmailService
  ) {
    super();
  }

  @Process('new-sail-request')
  async sendNewRequest(job: Job<SailRequestNewJob>) {
    const sail_request = await SailRequestEntity.findOne({ where: { id: job.data.sail_request_id } });

    const email = await this.sail_requestEmail.newSailRequest(sail_request);

    await this.emailService.sendBccEmail(email);
  }

  @Process('cancel-sail-request')
  async sendCancelledRequest(job: Job<SailRequestCancelJob>) {
    const sail_request = await SailRequestEntity.findOne({ where: { id: job.data.sail_request_id } });

    const email = await this.sail_requestEmail.cancelSailRequest(sail_request);

    await this.emailService.sendBccEmail(email);
  }

}
