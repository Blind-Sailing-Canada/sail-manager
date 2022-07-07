import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { Settings } from '../types/settings/settings';
import { ProfileEntity } from '../profile/profile.entity';
import { Setting } from '../types/settings/setting';

@Entity('settings')
export class SettingEntity extends BaseModelEntity implements Settings {
  @Column({ type: 'uuid' })
  @Index({ unique: true })
    profile_id: string;

  @Column({
    type: 'jsonb',
    array: false,
    default: {},
    nullable: false,
  })
    settings: Setting;

  @OneToOne(() => ProfileEntity)
  @JoinColumn({
    name: 'profile_id',
    referencedColumnName: 'id',
  })
    profile: ProfileEntity;

}
