import {
  Column,
  Entity
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { Token } from '../types/token/token';

@Entity('tokens')
export class TokenEntity extends BaseModelEntity implements Token {
  @Column({ type: 'uuid' })
    user_id: string;

  @Column()
    provider: string;

  @Column({
    type: 'timestamptz',
    nullable: false,
  })
    expire_at: Date;

  @Column({ type: 'text' })
    token: string;
}
