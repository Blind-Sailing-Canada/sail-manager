import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { SailEntity } from './sail.entity';

@Injectable()
export class SailService extends TypeOrmCrudService<SailEntity> {
  constructor(@InjectRepository(SailEntity) repo: Repository<SailEntity>) {
    super(repo);
  }
}
