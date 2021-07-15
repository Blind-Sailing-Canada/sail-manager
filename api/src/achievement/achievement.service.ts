import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { AchievementEntity } from './achievement.entity';

@Injectable()
export class AchievementService extends TypeOrmCrudService<AchievementEntity> {
  constructor(@InjectRepository(AchievementEntity) repo: Repository<AchievementEntity>) {
    super(repo);
  }
}
