import {
  forwardRef,
  Module
} from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FirebaseAdminController } from './firebase-admin.controller';
import { FirebaseAdminService } from './firebase-admin.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [FirebaseAdminController],
  providers: [FirebaseAdminService],
  exports: [FirebaseAdminService],
})
export class FirebaseAdminModule {}
