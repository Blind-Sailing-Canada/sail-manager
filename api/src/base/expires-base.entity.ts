import { Column } from 'typeorm';
import { ExpiresBase } from '../types/base/expires-base';
import { BaseModelEntity } from './base.entity';

export class ExpiresBaseModelEntity extends BaseModelEntity implements ExpiresBase {
  @Column({
    type: 'timestamptz',
    nullable: true,
    default: null,
  })
    expires_at: Date;
}
