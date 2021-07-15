import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ClinicEntity } from './clinic.entity';

@Injectable()
export class ClinicService extends TypeOrmCrudService<ClinicEntity> {
  constructor(@InjectRepository(ClinicEntity) repo: Repository<ClinicEntity>) {
    super(repo);
  }
}
