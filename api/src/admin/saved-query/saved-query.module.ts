import { Module } from '@nestjs/common';
import { SavedQueryEntity } from './saved-query.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../auth/auth.module';
import { SavedQueryController } from './saved-query.controller';
import { SavedQueryService } from './saved-query.service';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([SavedQueryEntity]),
  ],
  controllers: [SavedQueryController],
  providers: [SavedQueryService],
})
export class SavedQueryModule { }
