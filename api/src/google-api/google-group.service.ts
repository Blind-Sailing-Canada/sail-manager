import {
  google, admin_directory_v1
} from 'googleapis';
import {
  Injectable, Logger
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { ProfileEntity } from '../profile/profile.entity';
import { In } from 'typeorm';
import { GroupMember } from '../types/group/group-member';

@Injectable()
export class GoogleGroupService {
  private admin: admin_directory_v1.Admin;
  private readonly logger = new Logger(GoogleGroupService.name);

  constructor() {
    this.connect();
  }

  private async connect() {
    if (process.env.allowGoogleGroupManagement !== 'true') {
      return false;
    }

    const jwtClient = new google.auth.JWT(
      {
        subject: process.env.GOOGLE_API_CLIENT_EMAIL,
        email: process.env.GOOGLE_API_CLIENT_EMAIL,
        key: process.env.GOOGLE_API_PRIVATE_KEY.replace(/\\n/g, '\n'),
        keyId: process.env.GOOGLE_API_PRIVATE_KEY_ID,
        scopes: [
          'https://www.googleapis.com/auth/admin.directory.group',
          'https://www.googleapis.com/auth/admin.directory.group.member'
        ],
      }
    );

    await jwtClient
      .authorize()
      .catch(error => {
        this.logger.error('failed to authorize google group in connect()');
        this.logger.error(error);
        Sentry.captureException(error);
        throw error;
      });

    this.admin = google.admin({
      version: 'directory_v1',
      auth: jwtClient,
    });

    return true;
  }

  async listGroupMembers(groupEmail: string): Promise<GroupMember[]> {
    if (!await this.connect()) {
      return [];
    }

    const groupMembers = await this.getMoreGroupMembers(groupEmail, '');

    const emails: string[] = groupMembers.map(member => member.email)
      .filter(Boolean).map(email => email.toLowerCase().trim());

    const profiles = (await ProfileEntity.find({ where: { email: In(emails) } }))
      .reduce((red, profile) => {
        red[profile.email] = profile;
        return red;
      }, {});

    return groupMembers.map((member) => {
      return {
        member: member,
        profile: profiles[member.email],
      };
    });
  }

  async addGroupMember(groupEmail: string, memberEmail: string) {
    if (!await this.connect()) {
      return;
    }

    const result = await this.admin.members.insert({
      groupKey: groupEmail,
      requestBody: {
        email: memberEmail,
        role: 'MEMBER',
      }
    });

    return result.data;
  }

  async removeGroupMember(groupEmail: string, memberEmail: string) {
    if (!await this.connect()) {
      return;
    }

    const result = await this.admin.members.delete({
      groupKey: groupEmail,
      memberKey: memberEmail,
    });

    return result.data;
  }

  private async getMoreGroupMembers(groupEmail: string, pageToken: string): Promise<admin_directory_v1.Schema$Member[]> {
    const results: admin_directory_v1.Schema$Member[] = [];

    const response = await this.admin.members.list({
      groupKey: groupEmail,
      pageToken: pageToken,
    });

    results.push(...response.data.members);

    if (response.data.nextPageToken) {
      const more = await this.getMoreGroupMembers(groupEmail, response.data.nextPageToken);
      results.push(...more);
    }

    return results;
  }
}
