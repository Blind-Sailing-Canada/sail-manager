import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  In, LessThan
} from 'typeorm';
import { SailEmail } from '../email/sail.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { SailStatus } from '../types/sail/sail-status';
import { SailEntity } from './sail.entity';

@Injectable()
export class SailJob {

  constructor(
    private sailEmail: SailEmail,
    private emailService: GoogleEmailService
  ) {}

  @Cron('0 0 1-31/2 * *') // Every second day at noon.
  async pastSailsWithoutSubmittedChecklists() {

    const twoDaysAgo = new Date();

    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const sails = await SailEntity.find({
      where: {
        end_at: LessThan(twoDaysAgo),
        status: In([
          SailStatus.New,
          SailStatus.Started
        ]),
      },
      order: { end_at: 'DESC' }
    });

    if (!sails.length) {
      return;
    }

    const emailInfo = await this.sailEmail.pastSailsWithoutChecklists(sails);

    await this.emailService.sendBccEmail(emailInfo);
  }

}
