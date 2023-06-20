import { Injectable } from '@nestjs/common';
import { Cron, } from '@nestjs/schedule';
import {
  In, LessThan
} from 'typeorm';
import { RequiredActionStatus } from '../types/required-action/required-action-status';
import { RequiredActionEntity } from './required-action.entity';

@Injectable()
export class RequiredActionJob {

  @Cron('0 0 1-31/2 * *') // Every second day at noon.
  async expiredRequiredActions() {
    const yearStart = new Date();

    yearStart.setMonth(0);
    yearStart.setDate(1);

    const twoDaysAgo = new Date();

    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    await RequiredActionEntity
      .update(
        {
          due_date: LessThan(twoDaysAgo),
          status: In([RequiredActionStatus.New,]),
        },
        { status: RequiredActionStatus.Dismissed }
      );
  }
}
