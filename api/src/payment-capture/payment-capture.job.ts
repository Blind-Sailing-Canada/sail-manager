import {
  Inject, Injectable, Logger
} from '@nestjs/common';
import {
  Cron, CronExpression
} from '@nestjs/schedule';
import { IsNull } from 'typeorm';
import { ProfileEntity } from '../profile/profile.entity';
import { PaymentCaptureEntity } from './payment-capture.entity';
import { PaymentCaptureService } from './payment-capture.service';

@Injectable()
export class PaymentCaptureJob {
  private logger: Logger = new Logger(PaymentCaptureJob.name);

  constructor(@Inject(PaymentCaptureService) private readonly service: PaymentCaptureService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async linkAllCapturesToProfile() {
    const captures = await PaymentCaptureEntity.find({ where: { profile_id: IsNull() } });

    for(const capture of captures) {
      try {
        await this.linkCaptureToProfile(capture.id);
      } catch (error) {
        this.logger.error(error);
      }
    }
  }

  async linkCaptureToProfile(capture_id: string) {
    const paymentCapture = await PaymentCaptureEntity.findOneBy({ id: capture_id });

    if (paymentCapture.profile_id) {
      return;
    }

    const profile = await ProfileEntity.findOneBy({ email: paymentCapture.customer_email });

    if (!profile) {
      return;
    }

    await this.service.assignToProfile(capture_id, profile.id);
  }

}
