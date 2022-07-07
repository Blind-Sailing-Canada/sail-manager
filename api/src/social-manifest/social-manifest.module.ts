import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { SocialManifestController } from './social-manifest.controller';
import { SocialManifestEntity } from './social-manifest.entity';
import { SocialManifestService } from './social-manifest.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SocialManifestEntity]),
    AuthModule,
  ],
  controllers: [SocialManifestController],
  providers: [SocialManifestService],
})
export class SocialManifestModule { }
