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
  'commentableId',
  'commentableType',
])
@Tree('materialized-path')
export class CommentEntity extends BaseModelEntity implements Comment  {
  @Column({ length: 1000 })
  comment: string;

  @Column()
  @Index()
  authorId: string;

  @ManyToOne(() => ProfileEntity, { eager: true })
  author: ProfileEntity

  @Column({ nullable: true })
  commentableId: string;

  @Column({ nullable: true })
  commentableType: string;

  @TreeChildren()
  replies: CommentEntity[];

  @TreeParent()
  parent: CommentEntity;

  @ManyToOne(() => SailEntity, () => null, { createForeignKeyConstraints: false })
  @JoinColumn([
    {
      name: 'commentableId',
      referencedColumnName: 'id',
    },
    {
      name: 'commentableType',
      referencedColumnName: 'entityType',
    },
  ])
  sail: SailEntity

  @ManyToOne(() => BoatMaintenanceEntity, () => null, { createForeignKeyConstraints: false })
  @JoinColumn([
    {
      name: 'commentableId',
      referencedColumnName: 'id',
    },
    {
      name: 'commentableType',
      referencedColumnName: 'entityType',
    },
  ])
  boatMaintenance: BoatMaintenanceEntity

  @ManyToOne(() => ChallengeEntity, () => null, { createForeignKeyConstraints: false })
  @JoinColumn([
    {
      name: 'commentableId',
      referencedColumnName: 'id',
    },
    {
      name: 'commentableType',
      referencedColumnName: 'entityType',
    },
  ])
  challenge: ChallengeEntity
}
