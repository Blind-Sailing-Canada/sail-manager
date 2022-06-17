import {
  Column,
  Entity
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { Token } from '../types/token/token';

@Entity('tokens')
export class TokenEntity extends BaseModelEntity implements Token {
  @Column()
    profile_id: string;

  @Column()
    provider: string;

  @Column({
    type: 'timestamptz',
    nullable: false,
  })
    expireAt: Date;

  @Column({ type: 'text' })
    token: string;
}
