import { Injectable } from '@nestjs/common';
import { DOMAIN } from '../auth/constants';
import { ProfileEntity } from '../profile/profile.entity';
import { SailPaymentClaimEntity } from '../sail-payment-claim/sail-payment-claim.entity';
import { EmailInfo } from '../types/email/email-info';
import { toLocalDate } from '../utils/date.util';

@Injectable()
export class MissingSailPaymentsEmail {

  async missingSailPaymentEmail(claims: SailPaymentClaimEntity[]): Promise<EmailInfo> {
    if (!claims?.length) {
      return;
    }

    const sendTo: Set<string> = new Set<string>();

    const sailCoordinators = await ProfileEntity.coordinators();
    const admins = await ProfileEntity.admins();

    sailCoordinators.forEach(coordinator => sendTo.add(coordinator.email));
    admins.forEach(admin => sendTo.add(admin.email));

    const emailInfo: EmailInfo = {
      bcc: Array.from(sendTo),
      subject: `COMPANY_NAME_SHORT_HEADER: outstanding sail payments as of ${toLocalDate(new Date())}`,
      content: `
        <html>
          <body>
            <h3>Outstanding sail payments</h3>
            <ul>${this.claimsList(claims)}</ul>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }

  private claimsList(claims: SailPaymentClaimEntity[]): string {
    return claims.reduce((red, claim) => {
      return `
      ${red}
      <li>
        Member: ${claim.profile.name} (${claim.profile.email}).
        Sail: <a href="${DOMAIN}/sails/view/${claim.sail.id}">${claim.sail.name}</a>.
        Date: ${toLocalDate(claim.sail.start_at)}. Guest: ${claim.guest_name || 'No'}
      </li>
      `.trim();
    }, '');
  }
}
