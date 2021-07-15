import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';
import { GoogleApiModule } from '../google-api/google-api.modeul';
import { SailActionsController } from './sail-actions.controller';
import { SailCommentsController } from './sail-comments.controller';
import { SailPicturesController } from './sail-pictures.controller';
import { SailController } from './sail.controller';
import { SailEntity } from './sail.entity';
import { SailProcessor } from './sail.processor';
import { SailService } from './sail.service';
import { UserSailController } from './user-sail.controller';

@Module({
  imports: [
    AuthModule,
    BullModule.registerQueue({ name: 'sail' }),
    EmailModule,
    FirebaseAdminModule,
    TypeOrmModule.forFeature([SailEntity]),
    GoogleApiModule,
  ],
  controllers: [
    SailController,
    UserSailController,
    SailActionsController,
    SailCommentsController,
    SailPicturesController,
  ],
  providers: [
    SailService,
    SailProcessor,
  ],
})
export class SailModule { }
