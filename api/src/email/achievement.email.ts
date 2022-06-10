import { Injectable } from '@nestjs/common';
import { DOMAIN } from '../auth/constants';
import { Achievement } from '../types/achievement/achievement';
import { EmailInfo } from '../types/email/email-info';

@Injectable()
export class AchievementEmail {

  newAchievement(achievement: Achievement): EmailInfo {
    if (!achievement?.profile) {
      return;
    }

    const sendTo: Set<string> = new Set<string>();

    sendTo.add(achievement.profile.email);

    const emailInfo: EmailInfo = {
      to: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: you earned a new achievement ${achievement.name}`,
      content:  `
        <html>
          <body>
            <p>Good job! You earned "${achievement.name}" achievement.</p>
            <p>You can view your achievement in your <a href="${DOMAIN}/profiles/view/${achievement.profile_id}">profile</a></p>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }

}
