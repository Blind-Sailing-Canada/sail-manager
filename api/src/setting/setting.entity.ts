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

@Entity('setting')
export class SettingEntity extends BaseModelEntity implements Settings {
  @Column()
  @Index({ unique: true })
  profileId: string;

  @Column({
    type: 'json',
    array: false,
    default: () => '("{}")',
    nullable: false,
  })
  settings: Setting;

  @OneToOne(() => ProfileEntity)
  @JoinColumn()
  profile: ProfileEntity

}
