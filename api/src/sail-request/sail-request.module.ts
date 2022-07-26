import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { GoogleApiModule } from '../google-api/google-api.module';
import { SailRequestController } from './sail-request.controller';
import { SailRequestEntity } from './sail-request.entity';
import { SailRequestJob } from './sail-request.job';
import { SailRequestProcessor } from './sail-request.processor';
import { SailRequestService } from './sail-request.service';
import { SailRequestSubscriber } from './sail-request.subscriber';

@Module({
  imports: [
    AuthModule,
    BullModule.registerQueue({ name: 'sail-request' }),
    EmailModule,
    GoogleApiModule,
    TypeOrmModule.forFeature([SailRequestEntity]),
  ],
  controllers: [SailRequestController],
  providers: [
    SailRequestJob,
    SailRequestProcessor,
    SailRequestService,
    SailRequestSubscriber,
  ],
})
export class SailRequestModule { }
