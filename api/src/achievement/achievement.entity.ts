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

@Entity('achievement')
export class AchievementEntity extends BaseModelEntity implements Achievement {
  @Column()
  profileId: string;

  @ManyToOne(() => ProfileEntity)
  @JoinColumn()
  profile: ProfileEntity;

  @Column({ nullable: true })
  achievementType: string;

  @Column({ nullable: true })
  achievementId: string;

  @Column()
  @Index()
  name: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  @Index()
  badge: string;

}
