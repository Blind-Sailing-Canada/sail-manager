import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { User } from '../types/user/user';

@Entity('users')
@Index([
  'provider',
  'provider_user_id',
], { unique: true })
export class UserEntity extends BaseModelEntity implements User {
  @Column({ length: 50 })
    provider: string;

  @Column({ length: 150, })
    provider_user_id: string;

  @Column({
    type: 'uuid',
    default: null,
    nullable: true,
  })
    profile_id: string;

  @Column({
    default: null,
    nullable: true,
  })
    original_profile_id: string;

  @Column({
    default: null,
    nullable: true,
  })
    linked_by_profile_id: string;

  @OneToOne(() => ProfileEntity, undefined, {
    eager: false,
    createForeignKeyConstraints: false,
    nullable: true,
  })
  @JoinColumn({
    name: 'profile_id',
    referencedColumnName: 'id'
  })
    profile: ProfileEntity;
}
