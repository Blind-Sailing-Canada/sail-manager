import {
  forwardRef, Module
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserAccessController } from './user-access.controller';
import { UserAccessEntity } from './user-access.entity';
import { UserAccessService } from './user-access.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAccessEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserAccessController],
  providers: [UserAccessService],
  exports: [UserAccessService],
})
export class UserAccessModule { }
