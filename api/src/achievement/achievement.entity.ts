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
  @Column({ type: 'uuid' })
    profile_id: string;

  @ManyToOne(() => ProfileEntity)
  @JoinColumn({
    name: 'profile_id',
    referencedColumnName: 'id'
  })
    profile: ProfileEntity;

  @Column({ nullable: true })
    achievement_type: string;

  @Column({
    nullable: true,
    type: 'uuid'
  })
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
