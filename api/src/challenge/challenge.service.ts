import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ChallengeEntity } from './challenge.entity';

@Injectable()
export class ChallengeService extends TypeOrmCrudService<ChallengeEntity> {
  constructor(@InjectRepository(ChallengeEntity) repo: Repository<ChallengeEntity>) {
    super(repo);
  }
}
