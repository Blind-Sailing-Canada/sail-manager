import {
  Column,
  Entity,
  JoinColumn,
  OneToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { User } from '../types/user/user';

@Entity('users')
export class UserEntity extends BaseModelEntity implements User {
  @Column({ length: 50 })
    provider: string;

  @Column({
    length: 150,
    unique: true,
  })
    provider_user_id: string;

  @Column({ type: 'uuid' })
    profile_id: string;

  @Column()
    original_profile_id: string;

  @Column({
    default: null,
    nullable: true,
  })
    linked_by_profile_id: string;

  @OneToOne(() => ProfileEntity, undefined, {
    eager: false,
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
    nullable: true,
  })
  @JoinColumn({ referencedColumnName: 'id' })
    profile: ProfileEntity;
}
