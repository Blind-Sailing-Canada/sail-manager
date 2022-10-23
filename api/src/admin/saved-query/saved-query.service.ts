import {
  DataSource, Repository
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { SavedQueryEntity } from './saved-query.entity';
import {
  InjectDataSource, InjectRepository
} from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

@Injectable()
export class SavedQueryService extends TypeOrmCrudService<SavedQueryEntity>{
  public dataSource: DataSource;

  constructor(@InjectRepository(SavedQueryEntity) repo: Repository<SavedQueryEntity>, @InjectDataSource() dataSource: DataSource) {
    super(repo);
    this.dataSource = dataSource;
  }
}
