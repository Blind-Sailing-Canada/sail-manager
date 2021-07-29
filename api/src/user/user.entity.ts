import {
  Column,
  Entity,
  JoinColumn,
  OneToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { User } from '../types/user/user';

@Entity('user')
export class UserEntity extends BaseModelEntity implements User {
  @Column({ length: 50 })
  provider: string;

  @Column({
    length: 150,
    unique: true,
  })
  providerUserId: string;

  @Column()
  profileId: string;

  @Column()
  originalProfileId: string;

  @Column({
    default: null,
    nullable: true,
  })
  linkedByProfileId: string;

  @OneToOne(() => ProfileEntity, undefined, {
    eager: true,
    onDelete: 'CASCADE',
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ referencedColumnName: 'id' })
  profile: ProfileEntity
}
