import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { SailRequestInterestEntity } from './sail-request-interest.entity';

@Injectable()
export class SailRequestInterestService extends TypeOrmCrudService<SailRequestInterestEntity> {
  constructor(@InjectRepository(SailRequestInterestEntity) repo: Repository<SailRequestInterestEntity>) {
    super(repo);
  }
}
