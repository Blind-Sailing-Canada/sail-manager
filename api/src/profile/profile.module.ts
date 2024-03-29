import { BullModule } from '@nestjs/bull';
import {
  forwardRef, Module
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { GoogleApiModule } from '../google-api/google-api.module';
import { ProfileController } from './profile.controller';
import { ProfileEntity } from './profile.entity';
import { ProfileJob } from './profile.job';
import { ProfileProcessor } from './profile.processor';
import { ProfileService } from './profile.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'profile' }),
    EmailModule,
    GoogleApiModule,
    TypeOrmModule.forFeature([ProfileEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ProfileController],
  providers: [
    ProfileJob,
    ProfileProcessor,
    ProfileService,
  ],
  exports: [ProfileService],
})
export class ProfileModule { }
