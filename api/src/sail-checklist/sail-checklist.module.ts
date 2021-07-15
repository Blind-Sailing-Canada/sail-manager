import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SailChecklistController } from './sail-checklist.controller';
import { SailChecklistEntity } from './sail-checklist.entity';
import { SailChecklistService } from './sail-checklist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SailChecklistEntity]),
    AuthModule,
  ],
  controllers: [SailChecklistController],
  providers: [SailChecklistService],
})
export class SailChecklistModule { }
