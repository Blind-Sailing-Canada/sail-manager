import {
  Column, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { SailEntity } from '../sail/sail.entity';
import { Profile } from '../types/profile/profile';
import { SailWaitList } from '../types/sail-wait-list/sail-wait-list';
import { SailWaitListStatus } from '../types/sail-wait-list/sail-wait-list-status';
import { Sail } from '../types/sail/sail';

@Entity('sail_waiting_lists')
export class SailWaitListEntity extends BaseModelEntity implements SailWaitList {

  @ManyToOne(() => ProfileEntity, undefined, {
    nullable: true,
    eager: false,
  })
  @JoinColumn({
    name: 'profile_id',
    referencedColumnName: 'id',
  })
    profile: Profile;

  @Column({ type: 'uuid' })
  @Index()
    profile_id: string;

  @ManyToOne(() => SailEntity, undefined, {
    nullable: true,
    eager: false,
  })
  @JoinColumn({
    name: 'sail_id',
    referencedColumnName: 'id',
  })
    sail: Sail;

  @Column({ type: 'uuid' })
  @Index()
    sail_id: string;

  @Column({
    default: SailWaitListStatus.Open,
    enum: SailWaitListStatus,
    type: 'enum',
    nullable: false,
  })
  @Index()
    status: SailWaitListStatus;

  @DeleteDateColumn()
    deleted_at?: Date;

}
