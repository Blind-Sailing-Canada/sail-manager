import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { SailRequestEntity } from './sail-request.entity';

@Injectable()
export class SailRequestService extends TypeOrmCrudService<SailRequestEntity> {
  constructor(@InjectRepository(SailRequestEntity) repo: Repository<SailRequestEntity>) {
    super(repo);
  }
}
