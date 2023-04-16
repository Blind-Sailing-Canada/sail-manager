import { Injectable } from '@nestjs/common';
import { DOMAIN } from '../auth/constants';
import { ProfileEntity } from '../profile/profile.entity';
import { Clinic } from '../types/clinic/clinic';
import { EmailInfo } from '../types/email/email-info';
import { Profile } from '../types/profile/profile';

@Injectable()
export class ClinicEmail {

  async newAttendee(clinic: Clinic, attendee: Profile): Promise<EmailInfo> {
    if (!clinic || !attendee) {
      return;
    }

    const sendTo: Set<string> = new Set<string>();

    if (!clinic.instructor) {
      const sailCoordinators = await ProfileEntity.coordinators();

      sailCoordinators.forEach(coordinator => sendTo.add(coordinator.email));
    } else {
      sendTo.add(clinic.instructor.email);
    }

    if (!sendTo.size) {
      return;
    }

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER:  ${attendee.name} joined "${clinic.name}" clinic`,
      content:  `
        <html>
          <body>
            <a href="${DOMAIN}/clinics/view/${clinic.id}">View clinic</a>
          </body>
        </html>
      `.trim(),
    };

    return emailInfo;
  }
}
