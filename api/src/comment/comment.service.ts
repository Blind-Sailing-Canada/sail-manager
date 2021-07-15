import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { CommentEntity } from './comment.entity';

@Injectable()
export class CommentService extends TypeOrmCrudService<CommentEntity> {
  constructor(@InjectRepository(CommentEntity) repo: Repository<CommentEntity>) {
    super(repo);
  }
}
