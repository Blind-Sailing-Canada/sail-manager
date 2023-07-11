import {
  FindOptionsWhere, Repository
} from 'typeorm';
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
    const where = {} as FindOptionsWhere<SailEntity>;

    if (isNaN(Number(sail_id))) {
      where.id = sail_id;
    } else {
      where.entity_number = +sail_id;
    }

    return SailEntity.findOne({
      where,
      relations: [
        'checklists',
        'comments'
      ],
    });
  }
}
