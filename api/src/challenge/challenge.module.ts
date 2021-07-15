import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { GoogleApiModule } from '../google-api/google-api.modeul';
import { ChallengeController } from './challenge.controller';
import { ChallengeEntity } from './challenge.entity';
import { ChallengeProcessor } from './challenge.processor';
import { ChallengeService } from './challenge.service';

@Module({
  imports: [
    AuthModule,
    BullModule.registerQueue({ name: 'challenge' }),
    EmailModule,
    GoogleApiModule,
    TypeOrmModule.forFeature([ChallengeEntity]),
  ],
  controllers: [ChallengeController],
  providers: [
    ChallengeService,
    ChallengeProcessor,
  ],
})
export class ChallengeModule { }
