import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';
import { PaymentCaptureJob } from '../payment-capture/payment-capture.job';
import { PaymentCaptureNewJob } from '../types/payment-capture/payment-capture-new-job';
import { BaseQueueProcessor } from '../utils/base-queue-processor';

@Processor('stripe')
export class StripeProcessor extends BaseQueueProcessor {

  constructor(
    private paymentCaptureJob: PaymentCaptureJob,
  ) {
    super();
  }

  @Process('new-stripe-payment')
  async assignProfileToPayment(job: Job<PaymentCaptureNewJob>) {
    await this.paymentCaptureJob.linkCaptureToProfile(job.data.payment_capture_id);
  }
}
