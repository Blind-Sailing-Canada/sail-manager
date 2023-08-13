import { Injectable } from '@nestjs/common';
import { RELEASE_FORM_URL } from '../auth/constants';
import { ProfileEntity } from '../profile/profile.entity';
import { EmailInfo } from '../types/email/email-info';
import { Sail } from '../types/sail/sail';
import { toLocalDate } from '../utils/date.util';

@Injectable()
export class ReleaseFormEmail {

  async mustSignReleaseForm(person_name: string, email: string, sail: Sail): Promise<EmailInfo> {
    const sailCoordinators = await ProfileEntity.coordinators();

    const bcc: Set<string> = new Set<string>();
    sailCoordinators.forEach(coordinator => bcc.add(coordinator.email));

    const emailInfo: EmailInfo = {
      to: [email],
      bcc: Array.from(bcc),
      subject: `[Action required] COMPANY_NAME_SHORT_HEADER: must sign release form for sail #${sail.entity_number}`,
      content: `
        <html>
          <body>
            <p>Hello ${person_name},</p>
            <p>You are scheduled to go sailing on ${toLocalDate(sail.start_at)}.</p>
            <p>Before you can go on the sail you must sign a relase form.</p>
            <a href="${RELEASE_FORM_URL}">Click here to go to the release form.</a>
          </body>
        </html>
      `.trim(),
    };

    return emailInfo;
  }
}
