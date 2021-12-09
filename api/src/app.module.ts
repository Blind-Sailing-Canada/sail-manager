import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
import {
  HttpException, Module
} from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import {
  RavenInterceptor, RavenModule
} from 'nest-raven';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { BoatModule } from './boat/boat.module';
import { ProfileModule } from './profile/profile.module';
import { SailModule } from './sail/sail.module';
import { SailRequestModule } from './sail-request/sail-request.module';
import { SailManifestModule } from './sail-manifest/sail-manifest.module';
import { CommentModule } from './comment/comment.module';
import { BoatMaintenanceModule } from './boat-maintenance/boat-maintenance.module';
import { MediaModule } from './media/media.module';
import { RequiredActionModule } from './required-action/required-action.module';
import { ClinicModule } from './clinic/clinic.module';
import { SailFeedbackModule } from './sail-feedback/sail-feedback.module';
import { BoatInstructionsModule } from './boat-instructions/boat-instructions.module';
import { SailChecklistModule } from './sail-checklist/sail-checklist.module';
import { ChallengeModule } from './challenge/challenge.module';
import { UserModule } from './user/user.module';
import { UserAccessModule } from './user-access/user-access.module';
import { TokenModule } from './token/token.module';
import { AuthModule } from './auth/auth.module';
import { FirebaseAdminModule } from './firebase-admin/firebase-admin.module';
import { SailRequestInterestModule } from './sail-request-interest/sail-request-interest.module';
import { AchievementModule } from './achievement/achievement.module';
import { SettingModule } from './setting/setting.module';
import { EmailModule } from './email/email.module';
import { BoatChecklistModule } from './boat-checklist/boat-checklist.module';

const DB_LOGGING = [];

if (process.env.NODE_ENV !== 'prod'){
  DB_LOGGING.push('query');
  DB_LOGGING.push('error');
}

const DB_CONNECTION_META: ConnectionOptions = {
  type: process.env.DB_TYPE as any,
  url: process.env.DB_CONNECTION_STRING,
  logging: DB_LOGGING,
  entities: [
    // '**/*.entity.ts', // when debugging
    '**/*.entity.js',
  ],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  ssl: true,
  extra: { ssl: { rejectUnauthorized: false } },
  namingStrategy: new SnakeNamingStrategy(),
};

const redisUrl = new URL(process.env.REDIS_CONNECTION_STRING);

@Module({
  imports: [
    RavenModule,
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
    AuthModule,
    BoatChecklistModule,
    BoatInstructionsModule,
    BoatMaintenanceModule,
    BoatModule,
    ChallengeModule,
    ClinicModule,
    CommentModule,
    EmailModule,
    FirebaseAdminModule,
    MediaModule,
    ProfileModule,
    RequiredActionModule,
    SailChecklistModule,
    SailFeedbackModule,
    SailManifestModule,
    SailModule,
    SailRequestInterestModule,
    SailRequestModule,
    SettingModule,
    TokenModule,
    UserAccessModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor({ filters: [
      // Filter exceptions of type HttpException. Ignore those that
      // have status code of less than 500
        {
          type: HttpException,
          filter: (exception: HttpException) => 500 >= exception.getStatus(),
        },
      ] }),
    },
  ],
})
export class AppModule { }
