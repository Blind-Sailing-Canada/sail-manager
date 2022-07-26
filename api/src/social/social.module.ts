import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';
import { GoogleApiModule } from '../google-api/google-api.module';
import { SocialActionsController } from './social-actions.controller';
import { SocialCommentsController } from './social-comments.controller';
import { SocialPicturesController } from './social-pictures.controller';
import { SocialController } from './social.controller';
import { SocialEntity } from './social.entity';
import { SocialJob } from './social.job';
import { SocialProcessor } from './social.processor';
import { SocialService } from './social.service';

@Module({
  imports: [
    AuthModule,
    BullModule.registerQueue({ name: 'social' }),
    EmailModule,
    FirebaseAdminModule,
    TypeOrmModule.forFeature([SocialEntity]),
    GoogleApiModule,
  ],
  controllers: [
    SocialActionsController,
    SocialCommentsController,
    SocialController,
    SocialPicturesController,
  ],
  providers: [
    SocialJob,
    SocialProcessor,
    SocialService,
  ],
})
export class SocialModule { }
