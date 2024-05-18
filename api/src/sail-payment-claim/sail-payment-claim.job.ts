import {
  Inject, Injectable, Logger
} from '@nestjs/common';
import {
  Cron, CronExpression
} from '@nestjs/schedule';
import { IsNull } from 'typeorm';
import { MissingSailPaymentsEmail } from '../email/missing-sail-payments.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { SailPaymentClaimEntity } from './sail-payment-claim.entity';
import { SailPaymentClaimService } from './sail-payment-claim.service';

@Injectable()
export class SailPaymentClaimJob {
  private readonly logger = new Logger(SailPaymentClaimJob.name);

  constructor(
    @Inject(SailPaymentClaimService) private readonly service: SailPaymentClaimService,
    @Inject(MissingSailPaymentsEmail) private readonly missingPaymentEmail: MissingSailPaymentsEmail,
    private emailService: GoogleEmailService
  ) {}

  @Cron(CronExpression.EVERY_2_HOURS)
  async exhaustSailProducts() {
    await this.service.exhaustSailProducts();
  }

  @Cron(CronExpression.EVERY_HOUR)
  async linkAllClaimsToProfile() {
    await this.service.linkAllClaimsToProfile();
  }

  @Cron('0 0 1-31/2 * *') // Every second day at noon.
  async sendMissingPaymentsEmail() {
    if (process.env.sendMissingPaymentsEmail == 'false') {
      return;
    }
    const claims = await SailPaymentClaimEntity
      .find({
        relations: ['sail'],
        where: { product_purchase_id: IsNull() },
      } );

    const emailInfo = await this.missingPaymentEmail.missingSailPaymentEmail(claims);

    await this.emailService.sendBccEmail(emailInfo);
  }
}
