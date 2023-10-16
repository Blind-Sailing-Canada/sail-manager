import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { MediaTagEntity } from './media-tag.entity';

@Injectable()
export class MediaTagService extends TypeOrmCrudService<MediaTagEntity> {
  constructor(@InjectRepository(MediaTagEntity) repo: Repository<MediaTagEntity>) {
    super(repo);
  }
}
