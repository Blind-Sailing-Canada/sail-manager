import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { Access } from '../types/user-access/access';
import { DefaultUserAccess } from '../types/user-access/default-user-access';
import { UserAccess } from '../types/user-access/user-access';

@Entity('user_accesses')
export class UserAccessEntity extends BaseModelEntity implements UserAccess {
  @Column({
    type: 'json',
    array: false,
    default: () => `('${JSON.stringify(DefaultUserAccess)}')`,
    nullable: false,
  })
    access: Access;

  @Column({ type: 'uuid' })
  @Index()
    profile_id: string;

  @OneToOne(() => ProfileEntity, (profile) => profile.access)
  @JoinColumn({
    name: 'profile_id',
    referencedColumnName: 'id',
  })
    profile: ProfileEntity;
}
