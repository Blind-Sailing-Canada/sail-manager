import { Injectable } from '@nestjs/common';
import { DOMAIN } from '../auth/constants';
import { EmailInfo } from '../types/email/email-info';
import { Profile } from '../types/profile/profile';

@Injectable()
export class ProfileEmail {

  newProfileEmail(profile: Profile): EmailInfo {
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

}
