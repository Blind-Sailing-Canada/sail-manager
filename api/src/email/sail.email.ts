import { Injectable } from '@nestjs/common';
import { DOMAIN } from '../auth/constants';
import { ProfileEntity } from '../profile/profile.entity';
import { Comment } from '../types/comment/comment';
import { EmailInfo } from '../types/email/email-info';
import { Profile } from '../types/profile/profile';
import { SailorRole } from '../types/sail-manifest/sailor-role';
import { Sail } from '../types/sail/sail';
import { toLocalDate } from '../utils/date.util';

@Injectable()
export class SailEmail {

  pastSailsWithoutChecklistForSKipper(sails: Sail[], skipperName: string): EmailInfo {
    const emailInfo: EmailInfo = {
      subject: `COMPANY_NAME_SHORT_HEADER: Your past sail has not ended [${toLocalDate(new Date())}]`,
      content: `
      <html>
        <body>
        <h2>${skipperName}, some of your past sails do not have a correct status.</h2>
        <table>
          <caption>Here are your past sails that have not been marked as completed.</caption>
          <thead>
            <tr>
              <th>Sail #</th>
              <th>Name</th>
              <th>Ended At</th>
              <th>Boat</th>
              <th>Skipper</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${this.sailTableRows(sails)}
          </tbody>
        </table>
        <p><strong>These sails should be update with correct state in order to have accurate sail statistics.</strong></p>
        <p><strong>Please make sure to submit a sail checklist for each of the sails that were completed.</strong></p>
        </body>
      </html>
    `
    };

    return emailInfo;
  }

  async pastSailsWithoutChecklists(sails: Sail[]): Promise<EmailInfo> {
    const sendTo: Set<string> = new Set<string>();

    const admins = await ProfileEntity.admins();
    const fleetManagers = await ProfileEntity.fleetManagers();
    const sailCoordinators = await ProfileEntity.coordinators();

    admins?.forEach(admin => sendTo.add(admin.email));
    fleetManagers?.forEach(manager => sendTo.add(manager.email));
    sailCoordinators?.forEach(coordinator => sendTo.add(coordinator.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: Past sails that have not been marked as completed ${toLocalDate(new Date())}`,
      content: `
        <html>
          <body>
          <table>
            <caption>Past sails that have not been marked as completed</caption>
            <thead>
              <tr>
                <th>Sail #</th>
                <th>Name</th>
                <th>Ended At</th>
                <th>Boat</th>
                <th>Skipper</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${this.sailTableRows(sails)}
            </tbody>
          </table>
          <p><strong>These sails should be update with correct state in order to have accurate sail statistics.</strong></p>
          </body>
        </html>
      `
    };

    return emailInfo;
  }

  cancelSailEmail(sail: Sail, coordinators: Profile[]): EmailInfo {
    const sendTo: Set<string> = new Set<string>();

    sail
      .manifest
      .filter(sailor => sailor.profile_id)
      .filter(sailor => sailor.profile)
      .forEach(sailor => sendTo.add(sailor.profile.email));

    coordinators.forEach(coordinator => sendTo.add(coordinator.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: Sail #${sail.entity_number} was cancelled`,
      content: `
        <html>
          <body>
            <h2>Your sail "${sail.name}" (#${sail.entity_number}) was cancelled.</h2>
            <div>
              <label>Cancellation reason: </label> <span>${sail.cancel_reason}</span>
            </div>
            <div>
              <label>Cancelled by: </label> <span>${sail.cancelled_by.name}</span>
            </div>
            <div>
              <label>Cancelled at: </label> <span>${toLocalDate(sail.cancelled_at)}</span>
            </div>
            <br>
            <a href="${DOMAIN}/sails/view/${sail.id}">View sail</a>
          </body>
        </html>
      `.trim(),
    };

    return emailInfo;
  }

  newCommentEmail(sail: Sail, comment: Comment, coordinators: Profile[]): EmailInfo {
    const sendTo: Set<string> = new Set<string>();

    coordinators.forEach(coordinator => sendTo.add(coordinator.email));

    sail
      .manifest
      .filter(sailor => sailor.profile_id)
      .filter(sailor => sailor.profile)
      .forEach(sailor => sendTo.add(sailor.profile.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: New comment on sail #${sail.entity_number}`,
      content: `
        <html>
          <body>
            <h2>New comment for "${sail.name}" (#${sail.entity_number})</h2>
            <div>
              <label>Comment: </label> <pre>${comment.comment}</pre>
            </div>
            <div>
              <label>Posted by: </label> <span>${comment.author.name}</span>
            </div>
            <div>
              <label>Posted at: </label> <span>${toLocalDate(comment.created_at)}</span>
            </div>
            <br>
            <a href="${DOMAIN}/sails/view/${sail.id}">View sail</a>
          </body>
        </html>
      `.trim(),
    };

    return emailInfo;
  }

  futureSails(sails: Sail[]): EmailInfo {
    const emailInfo: EmailInfo = {
      subject: `COMPANY_NAME_SHORT_HEADER: Upcoming sails as of ${toLocalDate(new Date())}`,
      content: `
        <html>
          <body>
            <h3>Here are some upcoming sails</h3>
            <div>
              <dl>
              ${this.sailList(sails)}
              </dl>
            </div>
            <div>
              <p>You can change your notifications settings from the <a href="${DOMAIN}/profiles/settings">settings page</a>.
            </div>
          </body>
        </html>
      `.trim(),
    };

    return emailInfo;
  }

  private sailTableRows(sails: Sail[]): string {
    return sails
      .map(sail => `
        <tr>
          <td>${sail.entity_number}</td>
          <td><a href="${DOMAIN}/sails/view/${sail.id}" title="Click to view sail ${sail.name}">${sail.name}</a></td>
          <td>${toLocalDate(sail.end_at)}</td>
          <td>${sail.boat?.name || 'no boat'}</td>
          <td>${sail.manifest?.find(sailor => sailor.sailor_role == SailorRole.Skipper)?.person_name || 'no skipper'}</td>
          <td>${sail.status}</td>
        </tr>
      `)
      .join('\n');
  }

  private sailList(sails: Sail[]): string {
    return sails.reduce((red, sail) => {
      return `
      ${red}
      <dt><a href="${DOMAIN}/sails/view/${sail.id}">${toLocalDate(sail.start_at)} - ${sail.name} on ${sail.boat?.name}</a></dt>
      <dd>${sail.description}</dd>
      `.trim();
    }, '');
  }
}
