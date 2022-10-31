import { AuthModule } from '../auth/auth.module';
import { BullModule } from '@nestjs/bull';
import { EmailModule } from '../email/email.module';
import { GoogleApiModule } from '../google-api/google-api.module';
import { Module } from '@nestjs/common';
import { SailManifestController } from './sail-manifest.controller';
import { SailManifestEntity } from './sail-manifest.entity';
import { SailManifestGuestRelaseFormProcessor } from './sail-manifest-guest-release-form.processor';
import { SailManifestService } from './sail-manifest.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AuthModule,
    BullModule.registerQueue({ name: 'guest-release-form' }),
    BullModule.registerQueue({ name: 'sail' }),
    EmailModule,
    GoogleApiModule,
    TypeOrmModule.forFeature([SailManifestEntity]),
  ],
  controllers: [SailManifestController],
  providers: [
    SailManifestService,
    SailManifestGuestRelaseFormProcessor
  ],
})
export class SailManifestModule { }
