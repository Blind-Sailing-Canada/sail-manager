import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from './token.entity';
import { BaseService } from '../base/base.service';

@Injectable()
export class TokenService extends BaseService<TokenEntity> {
  constructor(@InjectRepository(TokenEntity) repo: Repository<TokenEntity>) {
    super(repo);
  }
}
