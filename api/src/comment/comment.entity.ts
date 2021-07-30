/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Tree,
  TreeChildren,
  TreeParent
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { BoatMaintenanceEntity } from '../boat-maintenance/boat-maintenance.entity';
import { ChallengeEntity } from '../challenge/challenge.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { SailEntity } from '../sail/sail.entity';
import { Comment } from '../types/comment/comment';

@Entity('comment')
@Index([
  'commentable_id',
  'commentable_type',
])
@Tree('materialized-path')
export class CommentEntity extends BaseModelEntity implements Comment  {
  @Column({ length: 1000 })
  comment: string;

  @Column()
  @Index()
  author_id: string;

  @ManyToOne(() => ProfileEntity, { eager: true })
  author: ProfileEntity

  @Column({ nullable: true })
  commentable_id: string;

  @Column({ nullable: true })
  commentable_type: string;

  @TreeChildren()
  replies: CommentEntity[];

  @TreeParent()
  parent: CommentEntity;

  @ManyToOne(() => SailEntity, () => null, { createForeignKeyConstraints: false })
  @JoinColumn([
    {
      name: 'commentable_id',
      referencedColumnName: 'id',
    },
    {
      name: 'commentable_type',
      referencedColumnName: 'entity_type',
    },
  ])
  sail: SailEntity

  @ManyToOne(() => BoatMaintenanceEntity, () => null, { createForeignKeyConstraints: false })
  @JoinColumn([
    {
      name: 'commentable_id',
      referencedColumnName: 'id',
    },
    {
      name: 'commentable_type',
      referencedColumnName: 'entity_type',
    },
  ])
  boat_maintenance: BoatMaintenanceEntity

  @ManyToOne(() => ChallengeEntity, () => null, { createForeignKeyConstraints: false })
  @JoinColumn([
    {
      name: 'commentable_id',
      referencedColumnName: 'id',
    },
    {
      name: 'commentable_type',
      referencedColumnName: 'entity_type',
    },
  ])
  challenge: ChallengeEntity
}
