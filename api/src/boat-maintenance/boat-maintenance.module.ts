import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';
import { GoogleApiModule } from '../google-api/google-api.module';
import { BoatMaintenanceController } from './boat-maintenance.controller';
import { BoatMaintenanceEntity } from './boat-maintenance.entity';
import { BoatMaintenanceProcessor } from './boat-maintenance.processor';
import { BoatMaintenanceService } from './boat-maintenance.service';
import { BoatMaintenanceSubscriber } from './boat-maintenance.subscriber';

@Module({
  imports: [
    AuthModule,
    BullModule.registerQueue({ name: 'boat-maintenance' }),
    EmailModule,
    FirebaseAdminModule,
    GoogleApiModule,
    TypeOrmModule.forFeature([BoatMaintenanceEntity]),
  ],
  controllers: [BoatMaintenanceController],
  providers: [
    BoatMaintenanceService,
    BoatMaintenanceSubscriber,
    BoatMaintenanceProcessor,
  ],
})
export class BoatMaintenanceModule { }
