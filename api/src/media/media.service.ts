import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaEntity } from './media.entity';

@Injectable()
export class MediaService extends TypeOrmCrudService<MediaEntity> {
  constructor(@InjectRepository(MediaEntity) repo: Repository<MediaEntity>) {
    super(repo);
  }
}
