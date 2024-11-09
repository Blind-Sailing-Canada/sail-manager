import { Injectable } from '@nestjs/common';
import { DOMAIN } from '../auth/constants';
import { BoatChecklistItem } from '../types/boat-checklist/boat-checklist-item';
import { EmailInfo } from '../types/email/email-info';
import { Profile } from '../types/profile/profile';
import { SailChecklistUpdateJob } from '../types/sail-checklist/sail-checklist-update-job';
import { diff } from 'json-diff';
import { SailManifest } from '../types/sail-manifest/sail-manifest';
import { SailChecklistType } from '../types/sail-checklist/sail-checklist-type';
import { diffStringHtml } from '../utils/strings';

@Injectable()
export class SailChecklistEmail {

  checklistUpdateEmail(
    data: SailChecklistUpdateJob,
    fleetManagers: Profile[],
    coordinators: Profile[]
  ): EmailInfo {
    const sendTo: Set<string> = new Set<string>();

    coordinators.forEach(coordinator => sendTo.add(coordinator.email));
    fleetManagers.forEach(manager => sendTo.add(manager.email));

    const checklistDiff = diff(data.current_checklist, data.updated_checklist, { full: true });

    console.log('checklistDiff', checklistDiff);

    const sail = data.sail;
    const beforeChecklist = data.current_checklist.checklist_type === SailChecklistType.Before
      ? null
      : sail.checklists?.find(checklist => checklist.checklist_type === SailChecklistType.Before);
    const checklist_type = data.current_checklist.checklist_type;
    const sail_destination = this.diffString(checklistDiff.sail_destination || beforeChecklist?.sail_destination);
    const weather = this.diffString(checklistDiff.weather || beforeChecklist?.weather);
    const checklist = checklistDiff.checklist;
    const comments = this.diffString(checklistDiff.comments);
    const signed_by_skipper = this.diffString(checklistDiff.signed_by_skipper);
    const signed_by_crew = this.diffString(checklistDiff.signed_by_crew);
    const updated_by_username = data.updated_by_username;

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: Sail #${sail.entity_number} has updated checklist (${checklist_type})`,
      content: `
        <html>
          <body>
            <h2>Sail "${sail.name}" (#${sail.entity_number}) "${checklist_type}" checklist was updated.</h2>
            <div>
              <label>Sail destination: </label> <span>${sail_destination || 'Not provided.'}</span>
            </div>
            <div>
              <label>Sail weather: </label> <span>${weather || 'Not provided.'}</span>
            </div>
            <div>
              <label>Sail status: </label> <span>${sail.status}</span>
            </div>
            <div>
              <label>Boat: </label> <span>${sail.boat?.name || 'Not provided.'}</span>
            </div>
            <div>
              <label>Checklist: </label> <div>${this.checklistTable(checklist, sail.boat?.checklist.items)}</div>
            </div>
            <div>
              <label>Checklist comments: </label> <span>${comments || 'Not provided.'}</span>
            </div>
            <div>
              <label>Signed by skipper: </label> <span>${signed_by_skipper}</span>
            </div>
            <div>
              <label>Signed by crew: </label> <span>${signed_by_crew}</span>
            </div>
            <div>
              <label>Updated by: </label> <span>${updated_by_username}</span>
            </div>
            <div>
              <label>First submitted: </label> <span>${data.updated_at}</span>
            </div>
            <div>
              <br/>
              ${this.sailManifestTable(data.sail.manifest, data.updated_manifest)}
            </div>
            <br>
            <a href="${DOMAIN}/sails/view/${sail.id}">View sail</a>
          </body>
        </html>
      `.trim(),
    };

    return emailInfo;
  }

  private diffString(value: any) {
    return diffStringHtml(value);
  }

  private sailManifestTable(sailManifest: SailManifest[], updatedManifest: SailManifest[]): string {
    sailManifest?.sort((a, b) => a.person_name.localeCompare(b.person_name));
    updatedManifest?.sort((a, b) => a.person_name.localeCompare(b.person_name));

    const manifestDiff = diff(sailManifest || [], updatedManifest || sailManifest || [], { full: true });

    console.log('manifestDiff', manifestDiff);

    const rows = manifestDiff
      ?.map(sailor_diff => Array.isArray(sailor_diff) ? sailor_diff[1] : sailor_diff)
      ?.map(sailor => `
      <tr>
        <td>${this.diffString(sailor.person_name)}</td>
        <td>${this.diffString(sailor.sailor_role)}</td>
        <td>${this.diffString(sailor.attended)}</td>
      </tr>
      `.trim())
      .join('');

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
    const keyToLabelMap: Record<string, string> = (boatChecklist || []).reduce((red, item) => {
      red[item.key] = item.label;
      return red;
    }, {});

    const normalized_checklist = {};

    const rows = Object
      .keys(checklist)
      .map(key => {
        const new_key = key.replace(/__added$/, '');
        normalized_checklist[new_key] = checklist[key];
        return new_key;
      })
      .filter(key => !key.endsWith('__deleted'))
      .map(key => `<tr><td>${keyToLabelMap[key] || key}</td><td>${this.diffString(normalized_checklist[key])}</td></tr>`)
      .join('');

    return `
      <table>
        <caption>Checklist</caption>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

}
