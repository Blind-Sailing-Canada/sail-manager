import { Injectable } from '@nestjs/common';
import { DOMAIN } from '../auth/constants';
import { EmailInfo } from '../types/email/email-info';
import { Profile } from '../types/profile/profile';
import { toLocalDate } from '../utils/date.util';

@Injectable()
export class ProfileEmail {

  newProfileEmail(profile: Profile): EmailInfo {
    if (!profile) {
      return;
    }

    const emailInfo: EmailInfo = {
      subject: `COMPANY_NAME_SHORT_HEADER: New profile (${profile.name}) is awaiting approval.`,
      content:  `
        <html>
          <body>
            <h2>New profile ${profile.name} (${profile.email}) is awaiting approval.</h2>
            <a href="${DOMAIN}/admin">Review profile</a>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }

  approvedProfileEmail(profile: Profile): EmailInfo {
    if (!profile) {
      return;
    }

    const emailInfo: EmailInfo = {
      to: [profile.email],
      subject: 'COMPANY_NAME_SHORT_HEADER: your account has been approved.',
      content:  `
        <html>
          <body>
            <p>Your profile ${profile.name} (${profile.email}) was approved.</p>
            <a href="${DOMAIN}/login">Login</a>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }

  awaitingApproval(profiles: Profile[]): EmailInfo {
    if (!profiles?.length) {
      return;
    }

    const emailInfo: EmailInfo = {
      subject: `COMPANY_NAME_SHORT_HEADER: profiles awaiting approvals as of ${toLocalDate(new Date())}`,
      content:  `
        <html>
          <body>
            <h3>Here is a list of profiles wating to be reviewed</h3>
            <div>
              <ol>${this.profileList(profiles)}</ol>
            </div>

            <a href="${DOMAIN}/login">Login</a>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }

  private profileList(profiles: Profile[]): string {
    return profiles.reduce((red, profile) => {
      return `
      ${red}
      <li><a href="${DOMAIN}/profiles/view/${profile.id}">${toLocalDate(profile.created_at)} - ${profile.name} (${profile.email})</a></li>
      `.trim();
    }, '');
  }

}
