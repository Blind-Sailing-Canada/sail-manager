import { InjectQueue } from '@nestjs/bull';
import {
  Controller, Logger, Post, Req, Res
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Queue } from 'bull';
import Stripe from 'stripe';
import { PaymentCaptureEntity } from '../payment-capture/payment-capture.entity';
import { PaymentCaptureNewJob } from '../types/payment-capture/payment-capture-new-job';
import { ProductType } from '../types/product-purchase/product-type';

const stripe = new Stripe(
  process.env.STRIPE_API_KEY,
  // @TODO figure out the api versions
  { apiVersion: process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion, }
);

@Controller('stripe')
@ApiTags('stripe')
export class StripeController {

  private readonly logger: Logger;

  constructor(
    @InjectQueue('stripe') private readonly stripeQueue: Queue
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
        captureEntity = await this.storeSuccesfulCheckoutSession(session.id);
        break;
      default:
        break;
    }

    if (captureEntity) {
      const job: PaymentCaptureNewJob = { payment_capture_id: captureEntity.id };

      this.stripeQueue.add('new-stripe-payment', job);
    }

    return res.send();
  }

  private async storeSuccesfulCheckoutSession(sessionId: string) {
    const expandedSession = await stripe.checkout.sessions
      .retrieve(
        sessionId,
        { expand: [
          'line_items',
          'line_items.data.price.product',
          'payment_link',
        ] }
      );
    const paymentCapture = new PaymentCaptureEntity();

    paymentCapture.customer_email = expandedSession.customer_details.email.trim().toLowerCase();
    paymentCapture.customer_name = expandedSession.customer_details.name.trim();
    paymentCapture.payment_processor = 'stripe';
    paymentCapture.product_name = expandedSession.line_items.data[0].description.trim();
    paymentCapture.product_quantity = expandedSession.line_items.data[0].quantity || 1;

    const paymentMetadata = expandedSession.metadata;
    const productMetadata = (expandedSession.line_items?.data[0]?.price?.product as any)?.metadata;

    paymentCapture.product_type = (paymentMetadata?.product_type ?? productMetadata?.product_type) || ProductType.UNKNOWN;
    paymentCapture.data = expandedSession;

    return paymentCapture.save();
  }

}
