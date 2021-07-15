import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { BoatInstructionsEntity } from './boat-instructions.entity';

@Injectable()
export class BoatInstructionsService extends TypeOrmCrudService<BoatInstructionsEntity> {
  constructor(@InjectRepository(BoatInstructionsEntity) repo: Repository<BoatInstructionsEntity>) {
    super(repo);
  }
}
