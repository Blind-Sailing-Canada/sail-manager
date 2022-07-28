import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { FormResponseEntity } from './form-response.entity';

@Injectable()
export class FormResponseService extends BaseService<FormResponseEntity> {
  constructor(
  @InjectRepository(FormResponseEntity) repo: Repository<FormResponseEntity>) {
    super(repo);
  }
}
