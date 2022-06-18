import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';
import { MediaController } from './media.controller';
import { MediaEntity } from './media.entity';
import { MediaService } from './media.service';

@Module({
  imports: [
    AuthModule,
    FirebaseAdminModule,
    TypeOrmModule.forFeature([MediaEntity]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule { }
