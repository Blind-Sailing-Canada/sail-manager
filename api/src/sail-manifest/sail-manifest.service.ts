import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { SailManifestEntity } from './sail-manifest.entity';

@Injectable()
export class SailManifestService extends TypeOrmCrudService<SailManifestEntity> {
  constructor(@InjectRepository(SailManifestEntity) repo: Repository<SailManifestEntity>) {
    super(repo);
  }
}
