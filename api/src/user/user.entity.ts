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

  @Column()
  profile_id: string;

  @Column()
  original_profile_id: string;

  @Column({
    default: null,
    nullable: true,
  })
  linked_by_profile_id: string;

  @OneToOne(() => ProfileEntity, undefined, {
    eager: true,
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ referencedColumnName: 'id' })
  profile: ProfileEntity
}
