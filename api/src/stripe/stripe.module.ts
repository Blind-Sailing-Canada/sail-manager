import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PaymentCaptureModule } from '../payment-capture/payment-capture.module';
import { StripeController } from './stripe.controller';
import { StripeProcessor } from './stripe.processor';

@Module({
  imports: [
    PaymentCaptureModule,
    BullModule.registerQueue({ name: 'stripe' }),
    PaymentCaptureModule,
  ],
  controllers: [StripeController],
  providers: [StripeProcessor],
})
export class StripeModule { }
