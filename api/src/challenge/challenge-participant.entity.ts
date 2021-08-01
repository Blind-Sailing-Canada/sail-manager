import {
  Column,
  Entity,
  Index,
  ManyToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { ChallengeEntity } from './challenge.entity';
import { ChallengeParticipant } from '../types/challenge/challenge-participant';

@Entity('challenge_participants')
@Index('participant-challenge-index', [
  'participant_id',
  'challenge_id',
], { unique: true })
export class ChallengeParticipantEntity extends BaseModelEntity implements ChallengeParticipant {
  @Column()
  participant_id: string;

  @Column()
  challenge_id: string;

  @Column({
    nullable: true,
    default: null,
    type: 'timestamptz',
  })
  finished_at: Date;

  @Column({
    nullable: true,
    default: null,
  })
  note: string;

  @ManyToOne(() => ChallengeEntity, (challenge) => challenge.participants)
  challenge: ChallengeEntity;

  @ManyToOne(() => ProfileEntity, (profile) => profile.challenges, { eager: true })
  participant: ProfileEntity;
}
