import { Injectable } from '@nestjs/common';
import { DOMAIN } from '../auth/constants';
import { EmailInfo } from '../types/email/email-info';
import { Profile } from '../types/profile/profile';
import { SailChecklist } from '../types/sail-checklist/sail-checklist';

@Injectable()
export class SailChecklistEmail {

  checklistUpdateEmail(sailChecklist: SailChecklist, fleetManagers: Profile[], coordinators: Profile[]): EmailInfo {
    const sendTo: Set<string> = new Set<string>();

    coordinators.forEach(coordinator => sendTo.add(coordinator.email));
    fleetManagers.forEach(manager => sendTo.add(manager.email));

    const sail = sailChecklist.sail;

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: Sail #${sail.entity_number} has updated checklist (${sailChecklist.checklist_type})`,
      content:  `
        <html>
          <body>
            <h2>Sail "${sail.name}" (#${sail.entity_number}) "${sailChecklist.checklist_type}" checklist was update.</h2>
            <div>
              <label>Sail destination: </label> <span>${sailChecklist.sail_destination}</span>
            </div>
            <div>
              <label>Sail weather: </label> <span>${sailChecklist.weather}</span>
            </div>
            <div>
              <label>Checklist: </label> <div>${JSON.stringify(sailChecklist.checklist || {}, null, 2)}</div>
            </div>
            <div>
              <label>Checklist comments: </label> <span>${sailChecklist.comments}</span>
            </div>
            <div>
              <label>Signed by skipper: </label> <span>${sailChecklist.signed_by_skipper}</span>
            </div>
            <div>
              <label>Signed by crew: </label> <span>${sailChecklist.signed_by_crew}</span>
            </div>
            <br>
            <a href="${DOMAIN}/sails/view/${sail.id}">View sail</a>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }

}
