import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { SailRequestEntity } from '../sail-request/sail-request.entity';
import { Profile } from '../types/profile/profile';
import { SailRequestInterest } from '../types/sail-request-interest/sail-request-interest';

@Entity('sail_request_interests')
@Index([
  'sail_request_id',
  'profile_id',
], { unique: true })
export class SailRequestInterestEntity extends BaseModelEntity implements SailRequestInterest {

  @Column()
  @Index()
  profile_id: string;

  @Column()
  @Index()
  sail_request_id: string;

  @ManyToOne(() => ProfileEntity, undefined, { eager: true })
  @JoinColumn()
  profile: Profile;

  @ManyToOne(() => SailRequestEntity, (sail_request) => sail_request.interest, { eager: false })
  @JoinColumn()
  sail_request: SailRequestEntity;
}
