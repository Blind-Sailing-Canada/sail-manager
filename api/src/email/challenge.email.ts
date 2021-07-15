import { Injectable } from '@nestjs/common';
import { DOMAIN } from '../auth/constants';
import { ProfileEntity } from '../profile/profile.entity';
import { Challenge } from '../types/challenge/challenge';
import { Comment } from '../types/comment/comment';
import { EmailInfo } from '../types/email/email-info';
import { Profile } from '../types/profile/profile';
import { toLocalDate } from '../utils/date.util';

@Injectable()
export class ChallengeEmail {

  async newAttendee(challenge: Challenge, attendee: Profile): Promise<EmailInfo> {
    const sendTo: Set<string> = new Set<string>();

    const sailCoordinators = await ProfileEntity.coordinators();

    sailCoordinators.forEach(coordinator => sendTo.add(coordinator.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER:  ${attendee.name} joined "${challenge.name}" challenge`,
      content:  `
        <html>
          <body>
            <a href="${DOMAIN}/challenges/view/${challenge.id}">View challenge</a>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }

  async newCommentEmail(challenge: Challenge, comment: Comment): Promise<EmailInfo> {
    const sendTo: Set<string> = new Set<string>();

    const sailCoordinators = await ProfileEntity.coordinators();

    sailCoordinators.forEach(coordinator => sendTo.add(coordinator.email));

    challenge
      .participants
      .forEach(participant => sendTo.add(participant.participant.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: New comment on challenge #${challenge.name}`,
      content: `
        <html>
          <body>
            <h2>New comment for "${challenge.name}</h2>
            <div>
              <label>Comment: </label> <span>${comment.comment}</span>
            </div>
            <div>
              <label>Posted by: </label> <span>${comment.author.name}</span>
            </div>
            <div>
              <label>Posted at: </label> <span>${toLocalDate(comment.createdAt)}</span>
            </div>
            <br>
            <a href="${DOMAIN}/challenges/view/${challenge.id}">View challenge</a>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }
}
