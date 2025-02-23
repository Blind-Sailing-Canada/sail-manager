import { Injectable } from '@nestjs/common';
import { DOMAIN } from '../auth/constants';
import { ProfileEntity } from '../profile/profile.entity';
import { SailRequestInterestEntity } from '../sail-request-interest/sail-request-interest.entity';
import { EmailInfo } from '../types/email/email-info';
import { SailRequest } from '../types/sail-request/sail-request';
import { toLocalDate } from '../utils/date.util';

@Injectable()
export class SailRequestEmail {

  async newSailRequest(sail_request: SailRequest): Promise<EmailInfo> {
    if (!sail_request) {
      return;
    }

    const sendTo: Set<string> = new Set<string>();

    const sailCoordinators = await ProfileEntity.coordinators();

    sailCoordinators.forEach(coordinator => sendTo.add(coordinator.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: new sail request #${sail_request.entity_number}`,
      content: `
        <html>
          <body>
            <h3>Sail request details</h3>
            <p>${sail_request.details}</p>
            <p>requested by ${sail_request.requested_by.name}</p>
            <a href="${DOMAIN}/sail-requests/view/${sail_request.id}">View sail request</a>
          </body>
        </html>
      `.trim(),
    };

    return emailInfo;
  }

  async unscheduledRequests(sailRequests: SailRequest[]): Promise<EmailInfo> {
    if (!sailRequests?.length) {
      return;
    }

    const sendTo: Set<string> = new Set<string>();

    const sailCoordinators = await ProfileEntity.coordinators();

    sailCoordinators.forEach(coordinator => sendTo.add(coordinator.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: sail requests as of ${toLocalDate(new Date())}`,
      content: `
        <html>
          <body>
            <h3>Here is a list of sail requests older than 2 days and which have not been scheduled</h3>
            <div>
              <ol>${this.requestList(sailRequests)}</ol>
            </div>
            <p>Their status should be updated to reflect their current state.</p>
          </body>
        </html>
      `.trim(),
    };

    return emailInfo;
  }

  async cancelSailRequest(sail_request: SailRequest): Promise<EmailInfo> {
    if (!sail_request) {
      return;
    }

    const sendTo: Set<string> = new Set<string>();

    const sailCoordinators = await ProfileEntity.coordinators();

    sailCoordinators.forEach(coordinator => sendTo.add(coordinator.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: sail request #${sail_request.entity_number} was cancelled`,
      content: `
        <html>
          <body>
            <p>Sail request ${sail_request.entity_number} was cancelled.</p>
            <a href="${DOMAIN}/sail-requests/view/${sail_request.id}">View sail request</a>
          </body>
        </html>
      `.trim(),
    };

    return emailInfo;
  }

  async newInterestSailRequest(sail_requestInterest: SailRequestInterestEntity): Promise<EmailInfo> {
    if (!sail_requestInterest?.sail_request) {
      return;
    }

    const sailCoordinators = await ProfileEntity.coordinators();

    if (!sailCoordinators?.length) {
      return;
    }

    const sendTo: Set<string> = new Set<string>();

    sailCoordinators.forEach(coordinator => sendTo.add(coordinator.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: new interest in sail request #${sail_requestInterest.sail_request.entity_number}`,
      content: `
        <html>
          <body>
            <p>
              <a href="${DOMAIN}/profiles/view/${sail_requestInterest.profile.id}">${sail_requestInterest.profile.name}</a>
              is interested in sail request #${sail_requestInterest.sail_request.entity_number}
            </p>
            <a href="${DOMAIN}/sail-requests/view/${sail_requestInterest.sail_request.id}">View sail request</a>
          </body>
        </html>
      `.trim(),
    };

    return emailInfo;
  }

  private requestList(requests: SailRequest[]): string {
    return requests.reduce((red, request) => {
      return `
      ${red}
      <li>
        <a href="${DOMAIN}/sail-requests/view/${request.id}">${toLocalDate(request.created_at)} - ${request.details}: ${request.status}</a>
      </li>
      `.trim();
    }, '');
  }
}
