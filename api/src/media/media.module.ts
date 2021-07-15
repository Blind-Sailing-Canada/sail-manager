import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MediaController } from './media.controller';
import { MediaEntity } from './media.entity';
import { MediaService } from './media.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MediaEntity]),
    AuthModule,
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule { }
