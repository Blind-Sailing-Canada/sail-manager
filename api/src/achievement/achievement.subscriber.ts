import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Queue } from 'bull';
import {
  Connection, EntitySubscriberInterface, InsertEvent
} from 'typeorm';
import { AchievementEntity } from './achievement.entity';

@Injectable()
export class AchievementSubscriber implements EntitySubscriberInterface<AchievementEntity> {

  constructor(
    @InjectConnection() readonly connection: Connection,
    @InjectQueue('achievement') private readonly achievementQueue: Queue
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return AchievementEntity;
  }

  afterInsert(event: InsertEvent<AchievementEntity>) {
    this.achievementQueue.add('new-achievement', { achievementId: event.entity.id });
  }

}
