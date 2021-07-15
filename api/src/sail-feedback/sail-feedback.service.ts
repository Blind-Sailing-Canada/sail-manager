import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { SailFeedbackEntity } from './sail-feedback.entity';

@Injectable()
export class SailFeedbackService extends TypeOrmCrudService<SailFeedbackEntity> {
  constructor(@InjectRepository(SailFeedbackEntity) repo: Repository<SailFeedbackEntity>) {
    super(repo);
  }
}
