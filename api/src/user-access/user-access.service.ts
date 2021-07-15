import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UserAccessEntity } from './user-access.entity';

@Injectable()
export class UserAccessService extends TypeOrmCrudService<UserAccessEntity> {
  constructor(@InjectRepository(UserAccessEntity) repo: Repository<UserAccessEntity>) {
    super(repo);
  }
}
