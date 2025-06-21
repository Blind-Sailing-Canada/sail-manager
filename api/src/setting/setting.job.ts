import { Injectable } from '@nestjs/common';
import {
  Cron, CronExpression
} from '@nestjs/schedule';
import {
  MoreThan, Not
} from 'typeorm';
import { SailEmail } from '../email/sail.email';
import { SocialEmail } from '../email/social.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { ProfileEntity } from '../profile/profile.entity';
import { SailEntity } from '../sail/sail.entity';
import { SocialEntity } from '../social/social.entity';
import { ProfileStatus } from '../types/profile/profile-status';
import { FutureSailsSubscription } from '../types/settings/future-sails-subscription';
import { SettingEntity } from './setting.entity';
import { SailStatus } from '../types/sail/sail-status';
import { SocialStatus } from '../types/social/social-status';

@Injectable()
export class SettingJob {

  constructor(
    private sailEmail: SailEmail,
    private socialEmail: SocialEmail,
    private emailService: GoogleEmailService,
  ) { }

  private async get_future_non_full_socials(): Promise<SocialEntity[]> {
    return SocialEntity.find({
      where: {
        start_at: MoreThan(new Date()),
        status: SocialStatus.New,
      },
      order: { start_at: 'ASC' },
      take: 10,
    }).then(socials => socials.filter(social => social.max_attendants === -1 || social.manifest.length < social.max_attendants));
  }

  private async send_future_socials_email(subscribers: ProfileEntity[]): Promise<void> {
    if (!subscribers.length) {
      return;
    }

    const futureSocials = await this.get_future_non_full_socials();

    if (!futureSocials.length) {
      return;
    }

    const emailInfo = this.socialEmail.futureSocials(futureSocials);

    const emailTo = subscribers.map(subscriber => subscriber.email);
    emailInfo.bcc = emailTo;

    await this.emailService.sendBccEmail(emailInfo);
  }

  private async get_future_non_full_sails(): Promise<SailEntity[]> {
    return SailEntity.find({
      where: {
        start_at: MoreThan(new Date()),
        is_private: Not<true>(true),
        status: SailStatus.New
      },
      order: { start_at: 'ASC' },
      take: 10,
    }).then((sails) => sails.filter(sail => sail.max_occupancy === -1 || sail.manifest.length < sail.max_occupancy));
  }

  private async send_future_sails_email(subscribers: ProfileEntity[]): Promise<void> {
    if (!subscribers.length) {
      return;
    }

    const futureSails = await this.get_future_non_full_sails();

    if (!futureSails.length) {
      return;
    }

    const emailInfo = this.sailEmail.futureSails(futureSails);

    const emailTo = subscribers.map(subscriber => subscriber.email);
    emailInfo.bcc = emailTo;

    await this.emailService.sendBccEmail(emailInfo);
  }

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

    await this.send_future_sails_email(subscribers);
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

    await this.send_future_socials_email(subscribers);
  }

  @Cron('0 0 1-31/2 * *') // Every second day at noon.
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

    await this.send_future_sails_email(subscribers);
  }

  @Cron('0 0 1-31/2 * *') // Every second day at noon.
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

    await this.send_future_socials_email(subscribers);
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

    await this.send_future_sails_email(subscribers);
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

    await this.send_future_socials_email(subscribers);
  }
}
