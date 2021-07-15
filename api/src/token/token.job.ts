import { Injectable } from '@nestjs/common';
import {
  Cron, CronExpression
} from '@nestjs/schedule';
import { LessThanOrEqual } from 'typeorm';
import { TokenEntity } from './token.entity';

@Injectable()
export class TokenJob {

  @Cron(CronExpression.EVERY_30_MINUTES)
  deleteExpiredTokens() {
    TokenEntity.delete({ expireAt: LessThanOrEqual(new Date()) } );
  }
}
