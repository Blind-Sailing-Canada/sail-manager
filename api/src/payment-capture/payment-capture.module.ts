import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ProductPurchaseModule } from '../product-purchase/product-purchase.module';
import { PaymentCaptureController } from './payment-capture.controller';
import { PaymentCaptureEntity } from './payment-capture.entity';
import { PaymentCaptureJob } from './payment-capture.job';
import { PaymentCaptureService } from './payment-capture.service';

@Module({
  imports: [
    AuthModule,
    ProductPurchaseModule,
    TypeOrmModule.forFeature([PaymentCaptureEntity]),
  ],
  controllers: [PaymentCaptureController],
  providers: [
    PaymentCaptureService,
    PaymentCaptureJob,
  ],
  exports: [
    PaymentCaptureJob,
    PaymentCaptureService
  ]
})
export class PaymentCaptureModule { }
