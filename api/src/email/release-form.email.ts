import { Injectable } from '@nestjs/common';
import { RELEASE_FORM_URL } from '../auth/constants';
import { ProfileEntity } from '../profile/profile.entity';
import { EmailInfo } from '../types/email/email-info';

@Injectable()
export class ReleaseFormEmail {

  async mustSignReleaseForm(email: string): Promise<EmailInfo> {
    const bcc: Set<string> = new Set<string>();

    const sailCoordinators = await ProfileEntity.coordinators();

    sailCoordinators.forEach(coordinator => bcc.add(coordinator.email));

    const emailInfo: EmailInfo = {
      to: [email],
      bcc: Array.from(bcc),
      subject: '[Action required] COMPANY_NAME_SHORT_HEADER: release form',
      content:  `
        <html>
          <body>
            <h1>You must sign a release form</h1>
            <p>Before you can go on a sail, you must sign a relase form.</p>
            
            <a href="${RELEASE_FORM_URL}">Click here to go to the release form.</a>
          </body>
        </html>
      `.trim(),
    };

    return emailInfo;
  }
}
