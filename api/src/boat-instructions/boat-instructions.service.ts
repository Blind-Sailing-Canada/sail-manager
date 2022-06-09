import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoatInstructionsEntity } from './boat-instructions.entity';
import { BaseService } from '../base/base.service';

@Injectable()
export class BoatInstructionsService extends BaseService<BoatInstructionsEntity> {
  constructor(
  @InjectRepository(BoatInstructionsEntity) repo: Repository<BoatInstructionsEntity>) {
    super(repo);
  }
}
