import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';
import { GoogleApiModule } from '../google-api/google-api.module';
import { SailPaymentClaimModule } from '../sail-payment-claim/sail-payment-claim.module';
import { SailActionsController } from './sail-actions.controller';
import { SailCategoryController } from './sail-category.controller';
import { SailCommentsController } from './sail-comments.controller';
import { SailPicturesController } from './sail-pictures.controller';
import { SailController } from './sail.controller';
import { SailEntity } from './sail.entity';
import { SailJob } from './sail.job';
import { SailProcessor } from './sail.processor';
import { SailService } from './sail.service';
import { SailSubscriber } from './sail.subscriber';
import { UserSailController } from './user-sail.controller';

@Module({
  imports: [
    AuthModule,
    BullModule.registerQueue({ name: 'sail' }),
    EmailModule,
    FirebaseAdminModule,
    GoogleApiModule,
    SailPaymentClaimModule,
    TypeOrmModule.forFeature([SailEntity]),
  ],
  controllers: [
    SailActionsController,
    SailCategoryController,
    SailCommentsController,
    SailController,
    SailPicturesController,
    UserSailController,
  ],
  providers: [
    SailJob,
    SailProcessor,
    SailService,
    SailSubscriber,
  ],
  exports: [SailService]
})
export class SailModule { }
