import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { SocialManifestEntity } from './social-manifest.entity';

@Injectable()
export class SocialManifestService extends TypeOrmCrudService<SocialManifestEntity> {
  constructor(@InjectRepository(SocialManifestEntity) repo: Repository<SocialManifestEntity>) {
    super(repo);
  }
}
