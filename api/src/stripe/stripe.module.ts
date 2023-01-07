import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { PaymentCaptureModule } from '../payment-capture/payment-capture.module';
import { PaymentCaptureProcessorType } from '../types/payment-capture/payment-capture-processor-type';
import { StripeController } from './stripe.controller';
import { StripeProcessor } from './stripe.processor';

@Module({
  imports: [
    PaymentCaptureModule,
    BullModule.registerQueue({ name: PaymentCaptureProcessorType.Stripe }),
    PaymentCaptureModule,
  ],
  controllers: [StripeController],
  providers: [StripeProcessor],
})
export class StripeModule { }
