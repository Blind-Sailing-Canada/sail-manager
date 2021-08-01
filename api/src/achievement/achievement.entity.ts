import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { Achievement } from '../types/achievement/achievement';
import { ProfileEntity } from '../profile/profile.entity';

@Entity('achievements')
export class AchievementEntity extends BaseModelEntity implements Achievement {
  @Column()
  profile_id: string;

  @ManyToOne(() => ProfileEntity)
  @JoinColumn()
  profile: ProfileEntity;

  @Column({ nullable: true })
  achievement_type: string;

  @Column({ nullable: true })
  achievement_id: string;

  @Column()
  @Index()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  @Index()
  badge: string;

}
