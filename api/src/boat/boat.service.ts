import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { BoatEntity } from './boat.entity';

@Injectable()
export class BoatService extends TypeOrmCrudService<BoatEntity> {
  constructor(@InjectRepository(BoatEntity) repo: Repository<BoatEntity>) {
    super(repo);
  }
}
