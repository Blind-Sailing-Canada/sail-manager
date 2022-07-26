import { Injectable } from '@nestjs/common';
import {
  Cron, CronExpression
} from '@nestjs/schedule';
import { ProfileEmail } from '../email/profile.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { ProfileStatus } from '../types/profile/profile-status';
import { ProfileEntity } from './profile.entity';

@Injectable()
export class ProfileJob {

  constructor(
    private profileEmail: ProfileEmail,
    private emailService: GoogleEmailService
  ) {}

  @Cron(CronExpression.EVERY_WEEK)
  async pendingApproval() {

    const profiles = await ProfileEntity.find({ where: { status: ProfileStatus.PendingApproval } });

    if (!profiles.length) {
      return;
    }

    const emailInfo = await this.profileEmail.awaitingApproval(profiles);

    const admins = (await ProfileEntity.admins()).map(admin => admin.email);

    emailInfo.bcc = admins;

    await this.emailService.sendBccEmail(emailInfo);
  }

}
