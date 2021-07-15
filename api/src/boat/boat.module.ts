import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BoatController } from './boat.controller';
import { BoatEntity } from './boat.entity';
import { BoatService } from './boat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoatEntity]),
    AuthModule,
  ],
  controllers: [BoatController],
  providers: [BoatService],
})
export class BoatModule { }
