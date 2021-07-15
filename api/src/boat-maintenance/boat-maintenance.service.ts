import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { BoatMaintenanceEntity } from './boat-maintenance.entity';
import { BoatMaintenanceEmail } from '../email/boat-maintenance.email';

@Injectable()
export class BoatMaintenanceService extends TypeOrmCrudService<BoatMaintenanceEntity> {
  constructor(
  @InjectRepository(BoatMaintenanceEntity) repo: Repository<BoatMaintenanceEntity>,
    private maintenanceEmail: BoatMaintenanceEmail
  ) {
    super(repo);
  }

}
