import { Injectable } from '@nestjs/common';
import { Cron, } from '@nestjs/schedule';
import {
  In, LessThan, MoreThan
} from 'typeorm';
import { SailEmail } from '../email/sail.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { ProfileEntity } from '../profile/profile.entity';
import { ProfileRole } from '../types/profile/profile-role';
import { ProfileStatus } from '../types/profile/profile-status';
import { SailorRole } from '../types/sail-manifest/sailor-role';
import { SailStatus } from '../types/sail/sail-status';
import { SailEntity } from './sail.entity';

type UserSailMap = Record<string, SailEntity[]>

@Injectable()
export class SailJob {

  constructor(
    private sailEmail: SailEmail,
    private emailService: GoogleEmailService
  ) {}

  @Cron('0 0 1-31/2 * *') // Every second day at noon.
  async pastSailThisYearWithoutChecklists() {
    const yearStart = new Date();

    yearStart.setMonth(0);
    yearStart.setDate(1);

    const twoDaysAgo = new Date();

    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const sails = await SailEntity.find({
      where: {
        end_at: LessThan(twoDaysAgo),
        start_at: MoreThan(yearStart),
        status: In([
          SailStatus.New,
          SailStatus.Started
        ]),
      },
      order: { end_at: 'DESC' }
    });

    const skipperEmailNameMap: Record<string, string> = {};
    const sailsBySkipper = sails.reduce((red: UserSailMap, sail) => {
      const skipper = sail.manifest?.find(sailor => sailor.sailor_role === SailorRole.Skipper)?.profile;

      if (!skipper) {
        return red;
      }

      if (skipper.status !== ProfileStatus.Approved) {
        return red;
      }

      if (!skipper.roles?.includes(ProfileRole.Skipper)) {
        return red;
      }

      if (!red[skipper.email]) {
        red[skipper.email] = [];
        skipperEmailNameMap[skipper.email] = skipper.name.split(' ')[0];
      }

      red[skipper.email].push(sail);
      return red;

    }, {}) as UserSailMap;

    const bccTo: Set<string> = new Set<string>();
    const admins = await ProfileEntity.admins();

    admins?.forEach(admin => bccTo.add(admin.email));

    Object
      .entries(sailsBySkipper)
      .forEach(async ([
        skipperEmail,
        skipperSails
      ]) => {
        const emailInfo = this.sailEmail
          .pastSailsWithoutChecklistForSKipper(skipperSails, skipperEmailNameMap[skipperEmail]);
        emailInfo.to = [skipperEmail];
        emailInfo.bcc = Array.from(bccTo);

        await this.emailService.sendToEmail(emailInfo);
      });
  }

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
