import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { GoogleApiModule } from '../google-api/google-api.module';
import { SailPaymentClaimController } from './sail-payment-claim.controller';
import { SailPaymentClaimEntity } from './sail-payment-claim.entity';
import { SailPaymentClaimJob } from './sail-payment-claim.job';
import { SailPaymentClaimService } from './sail-payment-claim.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([SailPaymentClaimEntity]),
    EmailModule,
    GoogleApiModule,
  ],
  controllers: [SailPaymentClaimController],
  providers: [
    SailPaymentClaimService,
    SailPaymentClaimJob
  ],
  exports: [SailPaymentClaimService]
})
export class SailPaymentClaimModule { }
