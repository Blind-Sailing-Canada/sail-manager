import { InjectQueue } from '@nestjs/bull';
import {
  Controller, Logger, Post, Req, Res
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Queue } from 'bull';
import Stripe from 'stripe';
import { PaymentCaptureEntity } from '../payment-capture/payment-capture.entity';
import { PaymentCaptureJobType } from '../types/payment-capture/payment-capture-job-type';
import { PaymentCaptureNewJob } from '../types/payment-capture/payment-capture-new-job';
import { PaymentCaptureProcessorType } from '../types/payment-capture/payment-capture-processor-type';
import { ProductType } from '../types/product-purchase/product-type';

const stripe = new Stripe(
  process.env.STRIPE_API_KEY,
  // @TODO figure out the api versions
  { apiVersion: process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion, }
);

@Controller(PaymentCaptureProcessorType.Stripe)
@ApiTags(PaymentCaptureProcessorType.Stripe)
export class StripeController {

  private readonly logger: Logger;

  constructor(
    @InjectQueue(PaymentCaptureProcessorType.Stripe) private readonly stripeQueue: Queue
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  @Post('/webhook')
  async webhook(@Req() req, @Res() res) {
    const sig = req.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_KEY);
    } catch (err) {
      this.logger.error(err);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    const session = event.data.object as Stripe.Response<Stripe.Checkout.Session>;

    let captureEntity: PaymentCaptureEntity;

    switch (event.type) {
      case 'checkout.session.completed':
        captureEntity = await this.storeSuccessfulCheckoutSession(session.id);
        break;
      default:
        break;
    }

    if (captureEntity) {
      const job: PaymentCaptureNewJob = { payment_capture_id: captureEntity.id };

      this.stripeQueue.add(PaymentCaptureJobType.NewStripePayment, job);
    }

    return res.send();
  }

  private async storeSuccessfulCheckoutSession(sessionId: string) {
    const expandedSession = await stripe.checkout.sessions
      .retrieve(
        sessionId,
        {
          expand: [
            'line_items',
            'line_items.data.price.product',
            'payment_link',
          ]
        }
      );

    const paymentMetadata = expandedSession.metadata;
    const productMetadata = (expandedSession.line_items?.data[0]?.price?.product as any)?.metadata;

    const ignore_capture = (paymentMetadata?.ignore_capture ?? productMetadata?.ignore_capture) === 'true';

    if (ignore_capture) {
      this.logger.log('Ignoring stripe capture because ignore_capture is true');
      return null;
    }

    const paymentCapture = new PaymentCaptureEntity();

    paymentCapture.customer_email = expandedSession.customer_details.email.trim().toLowerCase();
    paymentCapture.customer_name = expandedSession.customer_details.name.trim();
    paymentCapture.payment_processor = PaymentCaptureProcessorType.Stripe;
    paymentCapture.product_name = expandedSession.line_items.data[0].description.trim();
    paymentCapture.product_quantity = expandedSession.line_items.data[0].quantity || 1;
    paymentCapture.product_type = (paymentMetadata?.product_type ?? productMetadata?.product_type) || ProductType.UNKNOWN;
    paymentCapture.data = expandedSession;

    return paymentCapture.save();
  }

}
