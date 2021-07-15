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

@Entity('sail-request-interest')
@Index([
  'sailRequestId',
  'profileId',
], { unique: true })
export class SailRequestInterestEntity extends BaseModelEntity implements SailRequestInterest {

  @Column()
  @Index()
  profileId: string;

  @Column()
  @Index()
  sailRequestId: string;

  @ManyToOne(() => ProfileEntity, undefined, { eager: true })
  @JoinColumn()
  profile: Profile;

  @ManyToOne(() => SailRequestEntity, (sailRequest) => sailRequest.interest, { eager: false })
  @JoinColumn()
  sailRequest: SailRequestEntity;
}
