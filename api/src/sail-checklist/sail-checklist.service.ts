import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { SailChecklistEntity } from './sail-checklist.entity';

@Injectable()
export class SailChecklistService extends TypeOrmCrudService<SailChecklistEntity> {
  constructor(@InjectRepository(SailChecklistEntity) repo: Repository<SailChecklistEntity>) {
    super(repo);
  }
}
