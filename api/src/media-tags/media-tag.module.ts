import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';
import { MediaTagController } from './media-tag.controller';
import { MediaTagEntity } from './media-tag.entity';
import { MediaTagService } from './media-tag.service';

@Module({
  imports: [
    AuthModule,
    FirebaseAdminModule,
    TypeOrmModule.forFeature([MediaTagEntity]),
  ],
  controllers: [MediaTagController],
  providers: [MediaTagService],
})
export class MediaTagModule { }
