import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { GoogleApiModule } from '../google-api/google-api.modeul';
import { AchievementController } from './achievement.controller';
import { AchievementEntity } from './achievement.entity';
import { AchievementProcessor } from './achievement.processor';
import { AchievementService } from './achievement.service';
import { AchievementSubscriber } from './achievement.subscriber';

@Module({
  imports: [
    AuthModule,
    BullModule.registerQueue({ name: 'achievement' }),
    EmailModule,
    GoogleApiModule,
    TypeOrmModule.forFeature([AchievementEntity]),
  ],
  controllers: [AchievementController],
  providers: [
    AchievementProcessor,
    AchievementService,
    AchievementSubscriber,
  ],
})
export class AchievementModule { }
