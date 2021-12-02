import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { BoatChecklistEntity } from './boat-checklist.entity';

@Injectable()
export class BoatChecklistService extends TypeOrmCrudService<BoatChecklistEntity> {
  constructor(@InjectRepository(BoatChecklistEntity) repo: Repository<BoatChecklistEntity>) {
    super(repo);
  }
}
