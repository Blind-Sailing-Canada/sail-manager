import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';
import { PaymentCaptureJob } from '../payment-capture/payment-capture.job';
import { PaymentCaptureJobType } from '../types/payment-capture/payment-capture-job-type';
import { PaymentCaptureNewJob } from '../types/payment-capture/payment-capture-new-job';
import { PaymentCaptureProcessorType } from '../types/payment-capture/payment-capture-processor-type';
import { BaseQueueProcessor } from '../utils/base-queue-processor';

@Processor(PaymentCaptureProcessorType.Stripe)
export class StripeProcessor extends BaseQueueProcessor {

  constructor(
    private paymentCaptureJob: PaymentCaptureJob,
  ) {
    super();
  }

  @Process(PaymentCaptureJobType.NewStripePayment)
  async assignProfileToPayment(job: Job<PaymentCaptureNewJob>) {
    await this.paymentCaptureJob.linkCaptureToProfile(job.data.payment_capture_id);
  }
}
