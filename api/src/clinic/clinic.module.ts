import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { GoogleApiModule } from '../google-api/google-api.module';
import { ClinicController } from './clinic.controller';
import { ClinicEntity } from './clinic.entity';
import { ClinicProcessor } from './clinic.processor';
import { ClinicService } from './clinic.service';

@Module({
  imports: [
    AuthModule,
    BullModule.registerQueue({ name: 'clinic' }),
    EmailModule,
    GoogleApiModule,
    TypeOrmModule.forFeature([ClinicEntity]),
  ],
  controllers: [ClinicController],
  providers: [
    ClinicService,
    ClinicProcessor,
  ],
})
export class ClinicModule { }
