import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { SettingEntity } from './setting.entity';

@Injectable()
export class SettingService extends TypeOrmCrudService<SettingEntity> {
  constructor(@InjectRepository(SettingEntity) repo: Repository<SettingEntity>) {
    super(repo);
  }
}
