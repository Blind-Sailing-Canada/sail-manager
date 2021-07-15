import { Column } from 'typeorm';
import { ExpiresBase } from '../types/base/expires-base';
import { BaseModelEntity } from './base.entity';

export class ExpiresBaseModelEntity extends BaseModelEntity implements ExpiresBase {
  @Column({
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  expiresAt: Date;
}
