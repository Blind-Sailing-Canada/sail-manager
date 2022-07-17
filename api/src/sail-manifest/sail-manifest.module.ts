import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SailManifestController } from './sail-manifest.controller';
import { SailManifestEntity } from './sail-manifest.entity';
import { SailManifestService } from './sail-manifest.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SailManifestEntity]),
    AuthModule,
    BullModule.registerQueue({ name: 'sail' }),
  ],
  controllers: [SailManifestController],
  providers: [SailManifestService],
})
export class SailManifestModule { }
