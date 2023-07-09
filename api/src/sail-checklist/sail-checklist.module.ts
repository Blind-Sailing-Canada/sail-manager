import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { GoogleApiModule } from '../google-api/google-api.module';
import { SailModule } from '../sail/sail.module';
import { SailChecklistController } from './sail-checklist.controller';
import { SailChecklistEntity } from './sail-checklist.entity';
import { SailChecklistProcessor } from './sail-checklist.processor';
import { SailChecklistService } from './sail-checklist.service';

@Module({
  imports: [
    AuthModule,
    BullModule.registerQueue({ name: 'sail-checklist' }),
    EmailModule,
    GoogleApiModule,
    SailModule,
    TypeOrmModule.forFeature([SailChecklistEntity]),
  ],
  controllers: [SailChecklistController],
  providers: [
    SailChecklistProcessor,
    SailChecklistService,
  ],
})
export class SailChecklistModule { }
