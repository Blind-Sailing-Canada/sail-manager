import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LessThan } from 'typeorm';
import { SailRequestEmail } from '../email/sail-request.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { SailRequestStatus } from '../types/sail-request/sail-request-status';
import { SailRequestEntity } from './sail-request.entity';

@Injectable()
export class SailRequestJob {

  constructor(
    private sailRequestEmail: SailRequestEmail,
    private emailService: GoogleEmailService
  ) {}

  @Cron('0 0 1-31/2 * *') // Every second day at noon.
  async unschedledRequests() {

    const twoDaysAgo = new Date();

    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const requests = await SailRequestEntity.find({ where: {
      created_at: LessThan(twoDaysAgo),
      status: SailRequestStatus.New
    } });

    if (!requests.length) {
      return;
    }

    const emailInfo = await this.sailRequestEmail.unschedledRequests(requests);

    await this.emailService.sendBccEmail(emailInfo);
  }

}
