import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';
import { SailRequestEmail } from '../email/sail-request.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { BaseQueueProcessor } from '../utils/base-queue-processor';
import { SailRequestEntity } from './sail-request.entity';

@Processor('sail-request')
export class SailRequestProcessor extends BaseQueueProcessor {

  constructor(
    private sailRequestEmail: SailRequestEmail,
    private emailService: GoogleEmailService
  ) {
    super();
  }

  @Process('new-sail-request')
  async sendNewRequest(job: Job) {
    const sailRequest = await SailRequestEntity.findOneOrFail(job.data.sailRequestId);

    const email = await this.sailRequestEmail.newSailRequest(sailRequest);

    await this.emailService.sendBccEmail(email);
  }

  @Process('cancel-sail-request')
  async sendCancelledRequest(job: Job) {
    const sailRequest = await SailRequestEntity.findOneOrFail(job.data.sailRequestId);

    const email = await this.sailRequestEmail.cancelSailRequest(sailRequest);

    await this.emailService.sendBccEmail(email);
  }

}
