import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LessThan } from 'typeorm';
import { SocialEmail } from '../email/social.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { ProfileEntity } from '../profile/profile.entity';
import { SocialEntity } from '../social/social.entity';
import { SocialStatus } from '../types/social/social-status';

@Injectable()
export class SocialJob {

  constructor(
    private socialEmail: SocialEmail,
    private emailService: GoogleEmailService,
  ) {}

  @Cron('0 0 1-31/2 * *')
  async expiredSocials() {

    const aDayAgo = new Date();

    aDayAgo.setDate(aDayAgo.getDate() - 1);

    const expiredSocials = await SocialEntity.find({ where: {
      start_at: LessThan(aDayAgo),
      status: SocialStatus.New
    } });

    if (!expiredSocials.length) {
      return;
    }

    const emailInfo = this.socialEmail.expiredSocials(expiredSocials);

    const emailTo = (await ProfileEntity.coordinators()).filter(profile => profile.email).map(profile => profile.email);
    emailInfo.bcc = emailTo;

    await this.emailService.sendBccEmail(emailInfo);
  }

}
