import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { GoogleGroupService } from '../google-api/google-group.service';
import { GoogleApiModule } from '../google-api/google-api.module';

@Module({
  imports: [
    AuthModule,
    GoogleApiModule
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    GoogleGroupService
  ],
})
export class AdminModule { }
