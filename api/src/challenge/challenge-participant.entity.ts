import {
  Column,
  Entity,
  ManyToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { ChallengeEntity } from './challenge.entity';
import { ChallengeParticipant } from '../types/challenge/challenge-participant';

@Entity('challenge-participant')
export class ChallengeParticipantEntity extends BaseModelEntity implements ChallengeParticipant {
  @Column()
  participantId: string;

  @Column()
  challengeId: string;

  @Column({
    nullable: true,
    default: null,
  })
  finishedAt: Date;

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
