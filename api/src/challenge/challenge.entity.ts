import {
  Column,
  Entity,
  Index,
  OneToMany
} from 'typeorm';
import { ChallengeParticipantEntity } from './challenge-participant.entity';
import { Challenge } from '../types/challenge/challenge';
import { ChallengeStatus } from '../types/challenge/challenge-status';
import { CommentEntity } from '../comment/comment.entity';
import { MediaEntity } from '../media/media.entity';
import { DocumentEntity } from '../document/document.entity';
import { CreatedByBaseModelEntity } from '../base/created-by-base.entity';

@Entity('challenges')
export class ChallengeEntity extends CreatedByBaseModelEntity implements Challenge {
  @Column({
    length: 100,
    unique: true,
    nullable: false,
  })
  @Index('challenges_name')
    name: string;

  @Column({
    default: ChallengeEntity.name,
    nullable: false,
  })
    entity_type: string;

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
  @Index('challenges_status')
    status: ChallengeStatus;

  @Column({ default: 0 })
    max_occupancy: number;

  @Column({
    nullable: true,
    type: 'timestamptz',
  })
    start_date: Date;

  @Column({
    nullable: true,
    type: 'timestamptz',
  })
    end_date: Date;

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

  @OneToMany(() => DocumentEntity, (document) => document.challenge, {
    createForeignKeyConstraints: false,
    nullable: true,
    eager: true,
  })
    documents: DocumentEntity[];
}
