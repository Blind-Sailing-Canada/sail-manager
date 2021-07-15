import {
  Column,
  Entity
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { Token } from '../types/token/token';

@Entity('token')
export class TokenEntity extends BaseModelEntity implements Token {
  @Column()
  profileId: string;

  @Column()
  provider: string;

  @Column()
  expireAt: Date;

  @Column({ type: 'text' })
  token: string;
}
