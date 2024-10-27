import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, } from '@nestjs/schedule';
import {
  In, LessThan, MoreThan,
} from 'typeorm';
import { SailEmail } from '../email/sail.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { ProfileEntity } from '../profile/profile.entity';
import { ProfileRole } from '../types/profile/profile-role';
import { ProfileStatus } from '../types/profile/profile-status';
import { SailorRole } from '../types/sail-manifest/sailor-role';
import { SailStatus } from '../types/sail/sail-status';
import { SailEntity } from './sail.entity';
import * as RSS from 'rss';
import { toLocalDate } from '../utils/date.util';
const fs = require('node:fs/promises');

type UserSailMap = Record<string, SailEntity[]>

@Injectable()
export class SailJob {

  constructor(
    private sailEmail: SailEmail,
    private emailService: GoogleEmailService
  ) { }

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

  @Cron(CronExpression.EVERY_HOUR)
  async generateFutureSailsRss() {
    const feed = new RSS({
      title: 'COMPANY_NAME_SHORT_HEADER Upcoming Sails',
      description: 'A list of upcoming sails. Updated daily',
      generator: 'COMPANY_NAME_SHORT_HEADER System',
      feed_url: `${process.env.DOMAIN}/feed/upcoming_sails.rss`,
      site_url: `${process.env.DOMAIN}`,
      image_url: `${process.env.DOMAIN}/favicon.ico`,
      copyright: `${process.env.COPYRIGHT || 'Copyright 2024'}`,
      language: 'en-us',
      categories: ['Sails', 'COMPANY_NAME_SHORT_HEADER'],
      pubDate: new Date().toISOString(),
      ttl: 60 * 23,
      hub: `${process.env.DOMAIN}/feed/upcoming_sails.rss`,
    });

    const sails = await SailEntity.find(
      {
        where: {
          start_at: MoreThan(new Date()),
          is_private: false,
          status: SailStatus.New,
        },
        relations: ['manifest', 'boat'],
        take: 20,
        order: { start_at: 'ASC' }
      }
    );


    sails.forEach(sail => {
      const skipperCount = sail.manifest.filter((sailor => sailor.sailor_role === SailorRole.Sailor)).length;
      const crewCount = sail.manifest.filter((sailor => sailor.sailor_role === SailorRole.Crew)).length
      const sailorCount = sail.manifest.filter((sailor => [SailorRole.Guest, SailorRole.Member, SailorRole.Sailor].includes(sailor.sailor_role))).length
      const sailorCapacity = sail.max_occupancy - Math.max(2, skipperCount + crewCount);

      feed.item({
        title: sail.name,
        description: `Starts at ${toLocalDate(sail.start_at)}. Ends at ${toLocalDate(sail.end_at)}. Skipper: ${skipperCount}, Crew: ${crewCount}, Sailors: ${sailorCount}/${sailorCapacity}`,
        url: `${process.env.DOMAIN}/sails/${sail.id}`,
        guid: sail.id,
        categories: [sail.category || 'general sail'],
        author: 'system',
        date: sail.updated_at,
      })
    });

    const rssXml = feed.xml({ indent: true });
    console.log('__dirname====', __dirname);
    console.log('process.cwd()', process.cwd());

    await fs.mkdir('./app/feed', { recursive: true });
    await fs.writeFile('./app/feed/upcoming_sails.rss', rssXml).catch(error => console.log('failed to write rss file', error));
  }

}
