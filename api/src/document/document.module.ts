import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { DocumentEntity } from './document.entity';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { FirebaseAdminModule } from '../firebase-admin/firebase-admin.module';

@Module({
  imports: [
    AuthModule,
    FirebaseAdminModule,
    TypeOrmModule.forFeature([DocumentEntity]),
  ],
  controllers: [DocumentController],
  providers: [DocumentService],
})
export class DocumentModule { }
