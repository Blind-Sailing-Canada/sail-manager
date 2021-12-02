import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BoatChecklistController } from './boat-checklist.controller';
import { BoatChecklistEntity } from './boat-checklist.entity';
import { BoatChecklistService } from './boat-checklist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoatChecklistEntity]),
    AuthModule,
  ],
  controllers: [BoatChecklistController],
  providers: [BoatChecklistService],
})
export class BoatChecklistModule { }
