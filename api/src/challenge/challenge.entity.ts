import {
  Column,
  Entity,
  Index,
  OneToMany
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ChallengeParticipantEntity } from './challenge-participant.entity';
import { Challenge } from '../types/challenge/challenge';
import { ChallengeStatus } from '../types/challenge/challenge-status';
import { CommentEntity } from '../comment/comment.entity';
import { MediaEntity } from '../media/media.entity';

@Entity('challenge')
export class ChallengeEntity extends BaseModelEntity implements Challenge {
  @Column({
    length: 100,
    unique: true,
    nullable: false,
  })
  @Index('challenge_name')
  name: string;

  @Column({
    default: ChallengeEntity.name,
    nullable: false,
  })
  entityType: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  badge: string;

  @Column({
    default: ChallengeStatus.New,
    enum: ChallengeStatus,
    type: 'enum',
    nullable: false,
  })
  @Index('challenge_status')
  status: ChallengeStatus;

  @Column({ default: 0 })
  maxOccupancy: number;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @OneToMany(() => ChallengeParticipantEntity, (participant) => participant.challenge, { eager: true })
  participants: ChallengeParticipantEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.challenge, {
    createForeignKeyConstraints: false,
    nullable: true,
    eager: true,
  })
  comments: CommentEntity[];

  @OneToMany(() => MediaEntity, (picture) => picture.challenge, {
    createForeignKeyConstraints: false,
    nullable: true,
    eager: true,
  })
  pictures: MediaEntity[];
}
