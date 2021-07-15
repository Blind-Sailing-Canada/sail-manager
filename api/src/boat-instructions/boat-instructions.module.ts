import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BoatInstructionsController } from './boat-instructions.controller';
import { BoatInstructionsEntity } from './boat-instructions.entity';
import { BoatInstructionsService } from './boat-instructions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoatInstructionsEntity]),
    AuthModule,
  ],
  controllers: [BoatInstructionsController],
  providers: [BoatInstructionsService],
})
export class BoatInstructionsModule { }
