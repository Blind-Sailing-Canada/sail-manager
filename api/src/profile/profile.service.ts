import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileEntity } from './profile.entity';
import { BaseService } from '../base/base.service';

@Injectable()
export class ProfileService extends BaseService<ProfileEntity> {
  constructor(
  @InjectRepository(ProfileEntity) repo: Repository<ProfileEntity>) {
    super(repo);
  }
}
