import { Injectable } from '@nestjs/common';
import { DOMAIN } from '../auth/constants';
import { ProfileEntity } from '../profile/profile.entity';
import { SailRequestInterestEntity } from '../sail-request-interest/sail-request-interest.entity';
import { EmailInfo } from '../types/email/email-info';
import { SailRequest } from '../types/sail-request/sail-request';

@Injectable()
export class SailRequestEmail {

  async newSailRequest(sailRequest: SailRequest): Promise<EmailInfo> {
    const sendTo: Set<string> = new Set<string>();

    const sailCoordinators = await ProfileEntity.coordinators();

    sailCoordinators.forEach(coordinator => sendTo.add(coordinator.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER:  new sail request #${sailRequest.entityNumber}`,
      content:  `
        <html>
          <body>
            <h3>Sail request details</h3>
            <p>${sailRequest.details}</p>
            <p>requested by ${sailRequest.requestedBy.name}</p>
            <a href="${DOMAIN}/sail-requests/view/${sailRequest.id}">View sail request</a>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }

  async cancelSailRequest(sailRequest: SailRequest): Promise<EmailInfo> {
    const sendTo: Set<string> = new Set<string>();

    const sailCoordinators = await ProfileEntity.coordinators();

    sailCoordinators.forEach(coordinator => sendTo.add(coordinator.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: sail request #${sailRequest.entityNumber} was cancelled`,
      content:  `
        <html>
          <body>
            <p>Sail request ${sailRequest.entityNumber} was cancelled.</p>
            <a href="${DOMAIN}/sail-requests/view/${sailRequest.id}">View sail request</a>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }

  async newInterestSailRequest(sailRequestInterest: SailRequestInterestEntity): Promise<EmailInfo> {
    const sendTo: Set<string> = new Set<string>();

    const sailCoordinators = await ProfileEntity.coordinators();

    sailCoordinators.forEach(coordinator => sendTo.add(coordinator.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: new interest in sail request #${sailRequestInterest.sailRequest.entityNumber}`,
      content:  `
        <html>
          <body>
            <p>
              <a href="${DOMAIN}/profiles/view/${sailRequestInterest.profile.id}">${sailRequestInterest.profile.name}</a>
              is interested in sail request #${sailRequestInterest.sailRequest.entityNumber}
            </p>
            <a href="${DOMAIN}/sail-requests/view/${sailRequestInterest.sailRequest.id}">View sail request</a>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }
}
