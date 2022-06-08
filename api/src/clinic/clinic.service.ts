import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClinicEntity } from './clinic.entity';
import { BaseService } from '../base/base.service';

@Injectable()
export class ClinicService extends BaseService<ClinicEntity> {
  constructor(
  @InjectRepository(ClinicEntity) repo: Repository<ClinicEntity>) {
    super(repo);
  }
}
