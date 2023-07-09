import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SailEntity } from './sail.entity';
import { BaseService } from '../base/base.service';

@Injectable()
export class SailService extends BaseService<SailEntity> {
  constructor(@InjectRepository(SailEntity) repo: Repository<SailEntity>) {
    super(repo);
  }

  getFullyResolvedSail(sail_id: string): Promise<SailEntity> {
    return SailEntity.findOne({
      where: { id: sail_id },
      relations: [
        'checklists',
        'comments'
      ],
    });
  }
}
