import {
  DataSource, Repository
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  InjectDataSource, InjectRepository
} from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { SailWaitListEntity } from './sail-wait-list.entity';

@Injectable()
export class SailWaitListService extends TypeOrmCrudService<SailWaitListEntity>{
  public dataSource: DataSource;

  constructor(@InjectRepository(SailWaitListEntity) repo: Repository<SailWaitListEntity>, @InjectDataSource() dataSource: DataSource) {
    super(repo);
    this.dataSource = dataSource;
  }
}

