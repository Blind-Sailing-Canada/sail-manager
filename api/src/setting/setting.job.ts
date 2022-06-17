import { Injectable } from '@nestjs/common';
import {
  Cron, CronExpression
} from '@nestjs/schedule';
import { MoreThan } from 'typeorm';
import { SailEmail } from '../email/sail.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { SailEntity } from '../sail/sail.entity';
import { ProfileStatus } from '../types/profile/profile-status';
import { FutureSailsSubscription } from '../types/settings/future-sails-subscription';
import { SettingEntity } from './setting.entity';

@Injectable()
export class SettingJob {

  constructor(private sailEmail: SailEmail, private emailService: GoogleEmailService) {}

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

  @Cron('0 0 1-31/2 * *')
  async everyOtherDay() {
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

  @Cron('0 8 * * SUN')
  async everySunday() {
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
}
