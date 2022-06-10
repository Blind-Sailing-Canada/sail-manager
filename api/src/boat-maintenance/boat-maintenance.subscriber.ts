import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Queue } from 'bull';
import {
  Connection, EntitySubscriberInterface, InsertEvent, UpdateEvent
} from 'typeorm';
import { BoatMaintenanceNewRequestJob } from '../types/boat-maintenance/boat-maintenance-new-request-job';
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

  afterUpdate(event: UpdateEvent<BoatMaintenanceEntity>) {
    if (!event.entity) {
      return;
    }

    const job: BoatMaintenanceNewRequestJob = { maintenance_id: event.entity.id };
    this.boatMaintenanceQueue.add('update-request', job);
  }

  afterInsert(event: InsertEvent<BoatMaintenanceEntity>) {
    const job: BoatMaintenanceNewRequestJob = { maintenance_id: event.entity.id };
    this.boatMaintenanceQueue.add('new-request', job);
  }

}
