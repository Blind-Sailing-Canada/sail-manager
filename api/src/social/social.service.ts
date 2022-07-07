import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { SocialEntity } from './social.entity';

@Injectable()
export class SocialService extends BaseService<SocialEntity> {
  constructor(@InjectRepository(SocialEntity) repo: Repository<SocialEntity>) {
    super(repo);
  }
}
