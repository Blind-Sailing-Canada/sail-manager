import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { GoogleApiModule } from '../google-api/google-api.modeul';
import { SailRequestInterestController } from './sail-request-interest.controller';
import { SailRequestInterestEntity } from './sail-request-interest.entity';
import { SailRequestInterestProcessor } from './sail-request-interest.processor';
import { SailRequestInterestService } from './sail-request-interest.service';

@Module({
  imports: [
    AuthModule,
    BullModule.registerQueue({ name: 'sail-request-interest' }),
    EmailModule,
    GoogleApiModule,
    TypeOrmModule.forFeature([SailRequestInterestEntity]),
  ],
  controllers: [SailRequestInterestController],
  providers: [
    SailRequestInterestService,
    SailRequestInterestProcessor,
  ],
})
export class SailRequestInterestModule { }
