import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SailWaitListEntity } from './sail-wait-list.entity';
import { SailWaitListService } from './sail-wait-list.service';

@Module({
  imports: [TypeOrmModule.forFeature([SailWaitListEntity]),],
  controllers: [],
  providers: [SailWaitListService],
})
export class SailWaitListModule { }
