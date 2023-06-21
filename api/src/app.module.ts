import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AchievementModule } from './achievement/achievement.module';
import { AuthModule } from './auth/auth.module';
import { BoatChecklistModule } from './boat-checklist/boat-checklist.module';
import { BoatInstructionsModule } from './boat-instructions/boat-instructions.module';
import { BoatMaintenanceModule } from './boat-maintenance/boat-maintenance.module';
import { BoatModule } from './boat/boat.module';
import { ChallengeModule } from './challenge/challenge.module';
import { ClinicModule } from './clinic/clinic.module';
import { CommentModule } from './comment/comment.module';
import { DocumentModule } from './document/document.module';
import { EmailModule } from './email/email.module';
import { FirebaseAdminModule } from './firebase-admin/firebase-admin.module';
import { MediaModule } from './media/media.module';
import { ProfileModule } from './profile/profile.module';
import { RequiredActionModule } from './required-action/required-action.module';
import { SailChecklistModule } from './sail-checklist/sail-checklist.module';
import { SailFeedbackModule } from './sail-feedback/sail-feedback.module';
import { SailManifestModule } from './sail-manifest/sail-manifest.module';
import { SailModule } from './sail/sail.module';
import { SailRequestInterestModule } from './sail-request-interest/sail-request-interest.module';
import { SailRequestModule } from './sail-request/sail-request.module';
import { SettingModule } from './setting/setting.module';
import { TokenModule } from './token/token.module';
import { UserAccessModule } from './user-access/user-access.module';
import { UserModule } from './user/user.module';
import { SocialModule } from './social/social.module';
import { SocialManifestModule } from './social-manifest/social-manifest.module';
import { FormResponseModule } from './form-response/form-response.module';
import { AdminModule } from './admin/admin.module';
import { SavedQueryModule } from './admin/saved-query/saved-query.module';
import { StripeModule } from './stripe/stripe.module';
import { SailPaymentClaimModule } from './sail-payment-claim/sail-payment-claim.module';
import { PaymentCaptureModule } from './payment-capture/payment-capture.module';
import { ProductPurchaseModule } from './product-purchase/product-purchase.module';

const DB_LOGGING = [];

if (process.env.NODE_ENV !== 'prod'){
  DB_LOGGING.push('query');
  DB_LOGGING.push('error');
}

const DB_SSL = {} as any;

if (process.env.DB_SSL === 'true') {
  DB_SSL.ssl = process.env.NODE_ENV === 'prod';
  DB_SSL.extra = { ssl: { rejectUnauthorized: false } };
}

const DB_CONNECTION_META: ConnectionOptions = {
  type: process.env.DB_TYPE as any,
  url: process.env.DB_CONNECTION_STRING.replace(/\\n/gm, '\n'),
  logging: DB_LOGGING,
  entities: [
    // '**/*.entity.ts', // when debugging
    '**/*.entity.js',
  ],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  namingStrategy: new SnakeNamingStrategy(),
  ...DB_SSL,
};

const redisUrl = new URL(process.env.REDIS_CONNECTION_STRING.replace(/\\n/gm, '\n'));

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: redisUrl.hostname,
        password: redisUrl.password,
        port: Number(redisUrl.port),
        username: redisUrl.username,
      },
      defaultJobOptions: {
        delay: 30000,
        removeOnComplete: true,
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 60 * 1000,
        },
      },
    }),
    ServeStaticModule.forRoot({ rootPath: join(__dirname) }),
    TypeOrmModule.forRoot(DB_CONNECTION_META),
    ScheduleModule.forRoot(),
    AchievementModule,
    AdminModule,
    AuthModule,
    BoatChecklistModule,
    BoatInstructionsModule,
    BoatMaintenanceModule,
    BoatModule,
    ChallengeModule,
    ClinicModule,
    CommentModule,
    DocumentModule,
    EmailModule,
    FirebaseAdminModule,
    FormResponseModule,
    MediaModule,
    PaymentCaptureModule,
    ProductPurchaseModule,
    ProfileModule,
    RequiredActionModule,
    SailChecklistModule,
    SailFeedbackModule,
    SailManifestModule,
    SailModule,
    SailPaymentClaimModule,
    SailRequestInterestModule,
    SailRequestModule,
    SavedQueryModule,
    SettingModule,
    SocialManifestModule,
    SocialModule,
    StripeModule,
    TokenModule,
    UserAccessModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule {
}
