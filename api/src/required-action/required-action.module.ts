import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { RequiredActionController } from './required-action.controller';
import { RequiredActionEntity } from './required-action.entity';
import { RequiredActionJob } from './required-action.job';
import { RequiredActionService } from './required-action.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequiredActionEntity]),
    AuthModule,
  ],
  controllers: [RequiredActionController],
  providers: [
    RequiredActionJob,
    RequiredActionService,
  ],
})
export class RequiredActionModule { }
