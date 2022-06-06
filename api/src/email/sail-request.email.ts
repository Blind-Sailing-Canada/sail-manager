import { Injectable } from '@nestjs/common';
import { DOMAIN } from '../auth/constants';
import { ProfileEntity } from '../profile/profile.entity';
import { SailRequestInterestEntity } from '../sail-request-interest/sail-request-interest.entity';
import { EmailInfo } from '../types/email/email-info';
import { SailRequest } from '../types/sail-request/sail-request';

@Injectable()
export class SailRequestEmail {

  async newSailRequest(sail_request: SailRequest): Promise<EmailInfo> {
    const sendTo: Set<string> = new Set<string>();

    const sailCoordinators = await ProfileEntity.coordinators();

    sailCoordinators.forEach(coordinator => sendTo.add(coordinator.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER:  new sail request #${sail_request.entity_number}`,
      content:  `
        <html>
          <body>
            <h3>Sail request details</h3>
            <p>${sail_request.details}</p>
            <p>requested by ${sail_request.requested_by.name}</p>
            <a href="${DOMAIN}/sail-requests/view/${sail_request.id}">View sail request</a>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }

  async cancelSailRequest(sail_request: SailRequest): Promise<EmailInfo> {
    const sendTo: Set<string> = new Set<string>();

    const sailCoordinators = await ProfileEntity.coordinators();

    sailCoordinators.forEach(coordinator => sendTo.add(coordinator.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: sail request #${sail_request.entity_number} was cancelled`,
      content:  `
        <html>
          <body>
            <p>Sail request ${sail_request.entity_number} was cancelled.</p>
            <a href="${DOMAIN}/sail-requests/view/${sail_request.id}">View sail request</a>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }

  async newInterestSailRequest(sail_requestInterest: SailRequestInterestEntity): Promise<EmailInfo> {
    const sailCoordinators = await ProfileEntity.coordinators();

    if (!sailCoordinators?.length) {
      return;
    }

    const sendTo: Set<string> = new Set<string>();

    sailCoordinators.forEach(coordinator => sendTo.add(coordinator.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: new interest in sail request #${sail_requestInterest.sail_request.entity_number}`,
      content:  `
        <html>
          <body>
            <p>
              <a href="${DOMAIN}/profiles/view/${sail_requestInterest.profile.id}">${sail_requestInterest.profile.name}</a>
              is interested in sail request #${sail_requestInterest.sail_request.entity_number}
            </p>
            <a href="${DOMAIN}/sail-requests/view/${sail_requestInterest.sail_request.id}">View sail request</a>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }
}
