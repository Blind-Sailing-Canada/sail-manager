import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { GoogleApiModule } from '../google-api/google-api.module';
import { SettingController } from './setting.controller';
import { SettingEntity } from './setting.entity';
import { SettingJob } from './setting.job';
import { SettingService } from './setting.service';

@Module({
  imports: [
    AuthModule,
    EmailModule,
    GoogleApiModule,
    TypeOrmModule.forFeature([SettingEntity]),
  ],
  controllers: [SettingController],
  providers: [
    SettingService,
    SettingJob,
  ],
})
export class SettingModule { }
