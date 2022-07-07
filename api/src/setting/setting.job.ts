import { Injectable } from '@nestjs/common';
import {
  Cron, CronExpression
} from '@nestjs/schedule';
import { MoreThan } from 'typeorm';
import { SailEmail } from '../email/sail.email';
import { SocialEmail } from '../email/social.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { SailEntity } from '../sail/sail.entity';
import { SocialEntity } from '../social/social.entity';
import { ProfileStatus } from '../types/profile/profile-status';
import { FutureSailsSubscription } from '../types/settings/future-sails-subscription';
import { SettingEntity } from './setting.entity';

@Injectable()
export class SettingJob {

  constructor(
    private sailEmail: SailEmail,
    private socialEmail: SocialEmail,
    private emailService: GoogleEmailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async dailyFutureSails() {
    const subscribers = (await SettingEntity
      .getRepository()
      .createQueryBuilder('settings')
      .leftJoinAndSelect('settings.profile', 'profile')
      .where('settings->>\'futureSails\'= :futureSails AND profile.status=:status',
        {
          futureSails: FutureSailsSubscription.EveryDay,
          status: ProfileStatus.Approved,
        }
      )
      .getMany()).map(setting => setting.profile).filter(Boolean);

    if (!subscribers.length) {
      return;
    }

    const futureSails = await SailEntity.find({
      where: { start_at: MoreThan(new Date()) },
      order: { start_at: 'ASC' },
      take: 10,
    });

    if (!futureSails.length) {
      return;
    }

    const emailInfo = this.sailEmail.futureSails(futureSails);

    const emailTo = subscribers.map(subscriber => subscriber.email);
    emailInfo.bcc = emailTo;

    await this.emailService.sendBccEmail(emailInfo);
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async dailyFutureSocials() {
    const subscribers = (await SettingEntity
      .getRepository()
      .createQueryBuilder('settings')
      .leftJoinAndSelect('settings.profile', 'profile')
      .where('settings->>\'futureSocials\'= :futureSocials AND profile.status=:status',
        {
          futureSocials: FutureSailsSubscription.EveryDay,
          status: ProfileStatus.Approved,
        }
      )
      .getMany()).map(setting => setting.profile).filter(Boolean);

    if (!subscribers.length) {
      return;
    }

    const futureSocials = await SocialEntity.find({
      where: { start_at: MoreThan(new Date()) },
      order: { start_at: 'ASC' },
      take: 10,
    });

    if (!futureSocials.length) {
      return;
    }

    const emailInfo = this.socialEmail.futureSocials(futureSocials);

    const emailTo = subscribers.map(subscriber => subscriber.email);
    emailInfo.bcc = emailTo;

    await this.emailService.sendBccEmail(emailInfo);
  }

  @Cron('0 0 1-31/2 * *')
  async everyOtherDayFutureSails() {
    const subscribers = (await SettingEntity
      .getRepository()
      .createQueryBuilder('settings')
      .leftJoinAndSelect('settings.profile', 'profile')
      .where('settings->>\'futureSails\'= :futureSails AND profile.status=:status',
        {
          futureSails: FutureSailsSubscription.EveryOtherDay,
          status: ProfileStatus.Approved,
        }
      )
      .getMany()).map(setting => setting.profile).filter(Boolean);

    if (!subscribers.length) {
      return;
    }

    const futureSails = await SailEntity.find({
      where: { start_at: MoreThan(new Date()) },
      order: { start_at: 'ASC' },
      take: 10,
    });

    if (!futureSails.length) {
      return;
    }

    const emailInfo = this.sailEmail.futureSails(futureSails);

    const emailTo = subscribers.map(subscriber => subscriber.email);
    emailInfo.bcc = emailTo;

    await this.emailService.sendBccEmail(emailInfo);
  }

  @Cron('0 0 1-31/2 * *')
  async everyOtherDayFutureSocials() {
    const subscribers = (await SettingEntity
      .getRepository()
      .createQueryBuilder('settings')
      .leftJoinAndSelect('settings.profile', 'profile')
      .where('settings->>\'futureSocials\'= :futureSocials AND profile.status=:status',
        {
          futureSocials: FutureSailsSubscription.EveryOtherDay,
          status: ProfileStatus.Approved,
        }
      )
      .getMany()).map(setting => setting.profile).filter(Boolean);

    if (!subscribers.length) {
      return;
    }

    const futureSocials = await SocialEntity.find({
      where: { start_at: MoreThan(new Date()) },
      order: { start_at: 'ASC' },
      take: 10,
    });

    if (!futureSocials.length) {
      return;
    }

    const emailInfo = this.socialEmail.futureSocials(futureSocials);

    const emailTo = subscribers.map(subscriber => subscriber.email);
    emailInfo.bcc = emailTo;

    await this.emailService.sendBccEmail(emailInfo);
  }

  @Cron('0 8 * * SUN')
  async everySundayFutureSails() {
    const subscribers = (await SettingEntity
      .getRepository()
      .createQueryBuilder('settings')
      .leftJoinAndSelect('settings.profile', 'profile')
      .where('settings->>\'futureSails\'= :futureSails AND profile.status=:status',
        {
          futureSails: FutureSailsSubscription.EveryWeek,
          status: ProfileStatus.Approved,
        }
      )
      .getMany()).map(setting => setting.profile).filter(Boolean);

    if (!subscribers.length) {
      return;
    }

    const futureSails = await SailEntity.find({
      where: { start_at: MoreThan(new Date()) },
      order: { start_at: 'ASC' },
      take: 10,
    });

    if (!futureSails.length) {
      return;
    }

    const emailInfo = this.sailEmail.futureSails(futureSails);

    const emailTo = subscribers.map(subscriber => subscriber.email);
    emailInfo.bcc = emailTo;

    await this.emailService.sendBccEmail(emailInfo);
  }

  @Cron('0 8 * * SUN')
  async everySundayFutureSocials() {
    const subscribers = (await SettingEntity
      .getRepository()
      .createQueryBuilder('settings')
      .leftJoinAndSelect('settings.profile', 'profile')
      .where('settings->>\'futureSocials\'= :futureSocials AND profile.status=:status',
        {
          futureSocials: FutureSailsSubscription.EveryWeek,
          status: ProfileStatus.Approved,
        }
      )
      .getMany()).map(setting => setting.profile).filter(Boolean);

    if (!subscribers.length) {
      return;
    }

    const futureSocials = await SocialEntity.find({
      where: { start_at: MoreThan(new Date()) },
      order: { start_at: 'ASC' },
      take: 10,
    });

    if (!futureSocials.length) {
      return;
    }

    const emailInfo = this.socialEmail.futureSocials(futureSocials);

    const emailTo = subscribers.map(subscriber => subscriber.email);
    emailInfo.bcc = emailTo;

    await this.emailService.sendBccEmail(emailInfo);
  }
}
