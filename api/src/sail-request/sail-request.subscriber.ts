import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Queue } from 'bull';
import {
  Connection, EntitySubscriberInterface, InsertEvent
} from 'typeorm';
import { SailRequestEntity } from './sail-request.entity';

@Injectable()
export class SailRequestSubscriber implements EntitySubscriberInterface<SailRequestEntity> {

  constructor(
    @InjectConnection() readonly connection: Connection,
    @InjectQueue('sail-request') private readonly sailRequestQueue: Queue
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return SailRequestEntity;
  }

  afterInsert(event: InsertEvent<SailRequestEntity>) {
    this.sailRequestQueue.add('new-sail-request', { sailRequestId: event.entity.id });
  }

}
