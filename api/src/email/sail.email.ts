import { Injectable } from '@nestjs/common';
import { DOMAIN } from '../auth/constants';
import { Comment } from '../types/comment/comment';
import { EmailInfo } from '../types/email/email-info';
import { Profile } from '../types/profile/profile';
import { Sail } from '../types/sail/sail';
import { toLocalDate } from '../utils/date.util';

@Injectable()
export class SailEmail {

  cancelSailEmail(sail: Sail, coordinators: Profile[]): EmailInfo {
    const sendTo: Set<string> = new Set<string>();

    sail
      .manifest
      .filter(sailor => sailor.profile_id)
      .forEach(sailor => sendTo.add(sailor.profile.email));

    coordinators.forEach(coordinator => sendTo.add(coordinator.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: Sail #${sail.entity_number} was cancelled`,
      content:  `
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
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }

  newCommentEmail(sail: Sail, comment: Comment, coordinators: Profile[]): EmailInfo {
    const sendTo: Set<string> = new Set<string>();

    coordinators.forEach(coordinator => sendTo.add(coordinator.email));

    sail
      .manifest
      .filter(sailor => sailor.profile_id)
      .forEach(sailor => sendTo.add(sailor.profile.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: New comment on sail #${sail.entity_number}`,
      content: `
        <html>
          <body>
            <h2>New comment for "${sail.name}" (#${sail.entity_number})</h2>
            <div>
              <label>Comment: </label> <span>${comment.comment}</span>
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
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }

  futureSails(sails: Sail[]): EmailInfo {
    const emailInfo: EmailInfo = {
      subject: `COMPANY_NAME_SHORT_HEADER: Upcoming sailing as of ${toLocalDate(new Date())}`,
      content: `
        <html>
          <body>
            <h3>Here are some upcoming sails</h3>
            <div>
              <ol>
              ${this.sailList(sails)}
              </ol>
            </div>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }

  private sailList(sails: Sail[]): string {
    return sails.reduce((red, sail) => {
      return `${red}<li><a href="${DOMAIN}/sails/view/${sail.id}">${toLocalDate(sail.start_at)} - ${sail.name} on ${sail.boat.name}</a></li>`;
    }, '');
  }
}
