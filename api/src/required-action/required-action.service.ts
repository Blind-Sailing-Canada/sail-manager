import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { RequiredActionEntity } from './required-action.entity';

@Injectable()
export class RequiredActionService extends TypeOrmCrudService<RequiredActionEntity> {
  constructor(@InjectRepository(RequiredActionEntity) repo: Repository<RequiredActionEntity>) {
    super(repo);
  }
}
