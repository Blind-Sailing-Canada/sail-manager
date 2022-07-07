import { Injectable } from '@nestjs/common';
import { DOMAIN } from '../auth/constants';
import { Comment } from '../types/comment/comment';
import { EmailInfo } from '../types/email/email-info';
import { Profile } from '../types/profile/profile';
import { Social } from '../types/social/social';
import { toLocalDate } from '../utils/date.util';

@Injectable()
export class SocialEmail {

  cancelSocialEmail(social: Social, coordinators: Profile[]): EmailInfo {
    const sendTo: Set<string> = new Set<string>();

    social
      .manifest
      .filter(attendant => attendant.profile_id)
      .filter(attendant => attendant.profile)
      .forEach(attendant => sendTo.add(attendant.profile.email));

    coordinators.forEach(coordinator => sendTo.add(coordinator.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: Social #${social.entity_number} was cancelled`,
      content:  `
        <html>
          <body>
            <h2>Your social "${social.name}" (#${social.entity_number}) was cancelled.</h2>
            <div>
              <label>Cancellation reason: </label> <span>${social.cancel_reason}</span>
            </div>
            <div>
              <label>Cancelled by: </label> <span>${social.cancelled_by.name}</span>
            </div>
            <div>
              <label>Cancelled at: </label> <span>${toLocalDate(social.cancelled_at)}</span>
            </div>
            <br>
            <a href="${DOMAIN}/socials/view/${social.id}">View social</a>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }

  newCommentEmail(social: Social, comment: Comment, coordinators: Profile[]): EmailInfo {
    const sendTo: Set<string> = new Set<string>();

    coordinators.forEach(coordinator => sendTo.add(coordinator.email));

    social
      .manifest
      .filter(attendant => attendant.profile_id)
      .filter(attendant => attendant.profile)
      .forEach(attendant => sendTo.add(attendant.profile.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: New comment on social #${social.entity_number}`,
      content: `
        <html>
          <body>
            <h2>New comment for "${social.name}" (#${social.entity_number})</h2>
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
            <a href="${DOMAIN}/socials/view/${social.id}">View social</a>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }

  futureSocials(socials: Social[]): EmailInfo {
    const emailInfo: EmailInfo = {
      subject: `COMPANY_NAME_SHORT_HEADER: Upcoming socials as of ${toLocalDate(new Date())}`,
      content: `
        <html>
          <body>
            <h3>Here are some upcoming socials</h3>
            <div>
              <ol>
              ${this.socialList(socials)}
              </ol>
            </div>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }

  private socialList(socials: Social[]): string {
    return socials.reduce((red, social) => {
      return `
      ${red}
      <li><a href="${DOMAIN}/socials/view/${social.id}">${toLocalDate(social.start_at)} - ${social.name}</a></li>
      `.trim();
    }, '');
  }
}
