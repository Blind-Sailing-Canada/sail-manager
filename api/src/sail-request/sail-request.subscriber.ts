import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Queue } from 'bull';
import {
  Connection, EntitySubscriberInterface, InsertEvent
} from 'typeorm';
import { SailRequestNewJob } from '../types/sail-request/sail-request-new-job';
import { SailRequestEntity } from './sail-request.entity';

@Injectable()
export class SailRequestSubscriber implements EntitySubscriberInterface<SailRequestEntity> {

  constructor(
    @InjectConnection() readonly connection: Connection,
    @InjectQueue('sail-request') private readonly sail_requestQueue: Queue
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return SailRequestEntity;
  }

  afterInsert(event: InsertEvent<SailRequestEntity>) {
    const job: SailRequestNewJob = { sail_request_id: event.entity.id };

    this.sail_requestQueue.add('new-sail-request', job);
  }

}
