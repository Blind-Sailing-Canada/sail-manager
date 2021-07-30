import { Injectable } from '@nestjs/common';
import {
  Cron, CronExpression
} from '@nestjs/schedule';
import { LessThanOrEqual } from 'typeorm';
import { ProfileEntity } from '../profile/profile.entity';

@Injectable()
export class UserJob {

  @Cron(CronExpression.EVERY_30_MINUTES)
  async deleteUnregisteredAccounts() {
    ProfileEntity.delete({ expires_at: LessThanOrEqual(new Date()) });
  }
}
