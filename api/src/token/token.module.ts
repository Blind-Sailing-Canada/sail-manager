import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenService } from './toke.service';
import { TokenEntity } from './token.entity';
import { TokenJob } from './token.job';

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity])],
  controllers: [],
  providers: [
    TokenService,
    TokenJob,
  ],
  exports: [TokenService],
})
export class TokenModule { }
