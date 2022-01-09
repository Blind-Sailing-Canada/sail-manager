import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DocumentEntity } from './document.entity';

@Injectable()
export class DocumentService extends TypeOrmCrudService<DocumentEntity> {
  constructor(@InjectRepository(DocumentEntity) repo: Repository<DocumentEntity>) {
    super(repo);
  }
}
