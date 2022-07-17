import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Queue } from 'bull';
import {
  Connection,
  EntitySubscriberInterface,
  InsertEvent
} from 'typeorm';
import { SailNewJob } from '../types/sail/sail-new-job';
import { SailEntity } from './sail.entity';

@Injectable()
export class SailSubscriber implements EntitySubscriberInterface<SailEntity> {

  constructor(
    @InjectConnection() readonly connection: Connection,
    @InjectQueue('sail') private readonly sailQueue: Queue
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return SailEntity;
  }

  afterInsert(event: InsertEvent<SailEntity>) {
    const job: SailNewJob = {
      sail_id: event.entity.id,
      message: ''
    };

    this.sailQueue.add('new-sail', job);
  }

}
