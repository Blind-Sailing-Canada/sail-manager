import { Injectable } from '@nestjs/common';
import { DOMAIN } from '../auth/constants';
import { BoatChecklistItem } from '../types/boat-checklist/boat-checklist-item';
import { EmailInfo } from '../types/email/email-info';
import { Profile } from '../types/profile/profile';
import { SailChecklist } from '../types/sail-checklist/sail-checklist';

@Injectable()
export class SailChecklistEmail {

  checklistUpdateEmail(
    sailChecklist: SailChecklist,
    updated_by_username: string,
    fleetManagers: Profile[],
    coordinators: Profile[]
  ): EmailInfo {
    const sendTo: Set<string> = new Set<string>();

    coordinators.forEach(coordinator => sendTo.add(coordinator.email));
    fleetManagers.forEach(manager => sendTo.add(manager.email));

    const sail = sailChecklist.sail;

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: Sail #${sail.entity_number} has updated checklist (${sailChecklist.checklist_type})`,
      content: `
        <html>
          <body>
            <h2>Sail "${sail.name}" (#${sail.entity_number}) "${sailChecklist.checklist_type}" checklist was updated.</h2>
            <div>
              <label>Sail destination: </label> <span>${sailChecklist.sail_destination || 'Not provided.'}</span>
            </div>
            <div>
              <label>Sail weather: </label> <span>${sailChecklist.weather || 'Not provided.'}</span>
            </div>
            <div>
              <label>Sail status: </label> <span>${sail.status}</span>
            </div>
            <div>
              <label>Boat: </label> <span>${sail.boat?.name || 'Not provided.'}</span>
            </div>
            <div>
              <label>Checklist: </label> <div>${this.checklistTable(sailChecklist.checklist, sail.boat.checklist.items)}</div>
            </div>
            <div>
              <label>Checklist comments: </label> <span>${sailChecklist.comments || 'Not provided.'}</span>
            </div>
            <div>
              <label>Signed by skipper: </label> <span>${sailChecklist.signed_by_skipper}</span>
            </div>
            <div>
              <label>Signed by crew: </label> <span>${sailChecklist.signed_by_crew}</span>
            </div>
            <div>
              <label>Updated by: </label> <span>${updated_by_username}</span>
            </div>
            <div>
              <br/>
              ${this.sailManifestTable(sailChecklist)}
            </div>
            <br>
            <a href="${DOMAIN}/sails/view/${sail.id}">View sail</a>
          </body>
        </html>
      `.trim(),
    };

    return emailInfo;
  }

  private sailManifestTable(sailChecklist: SailChecklist): string {
    const rows = sailChecklist
      .sail
      ?.manifest
      ?.map(sailor => `<tr><td>${sailor.person_name}</td><td>${sailor.sailor_role}</td><td>${sailor.attended}</td></tr>`).join('');

    return `
      <table>
        <caption>Manifest</caption>
        <thead>
          <tr><th>Sailor</th><th>Role</th><th>Attended</th></tr>
          <tbody>
            ${rows}
          </tbody>
      </table>
    `;
  }

  private checklistTable(checklist: Map<string, string>, boatChecklist: BoatChecklistItem[]): string {
    const keyToLabelMap: Record<string, string> = boatChecklist.reduce((red, item) => {
      red[item.key] = item.label;
      return red;
    }, {});

    const rows = Object
      .keys(checklist)
      .map(key => `<tr><td>${keyToLabelMap[key] || key}</td><td>${checklist[key]}</td></tr>`)
      .join('');

    return `
      <table>
        <caption>Checklist</caption>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

}
