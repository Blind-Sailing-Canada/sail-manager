import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Queue } from 'bull';
import {
  Connection, EntitySubscriberInterface, InsertEvent
} from 'typeorm';
import { BoatMaintenanceNewJob } from '../types/boat-maintenance/boat-maintenance-new-job';
import { BoatMaintenanceEntity } from './boat-maintenance.entity';

@Injectable()
export class BoatMaintenanceSubscriber implements EntitySubscriberInterface<BoatMaintenanceEntity> {

  constructor(
    @InjectConnection() readonly connection: Connection,
    @InjectQueue('boat-maintenance') private readonly boatMaintenanceQueue: Queue
  ) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return BoatMaintenanceEntity;
  }

  afterInsert(event: InsertEvent<BoatMaintenanceEntity>) {
    const job: BoatMaintenanceNewJob = { maintenance_id: event.entity.id };
    this.boatMaintenanceQueue.add('new-request', job);
  }

}
