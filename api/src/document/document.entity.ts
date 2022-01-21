/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { BoatEntity } from '../boat/boat.entity';
import { ChallengeEntity } from '../challenge/challenge.entity';
import { CommentEntity } from '../comment/comment.entity';
import { Document } from '../types/document/document';
import { ProfileEntity } from '../profile/profile.entity';
import { ClinicEntity } from '../clinic/clinic.entity';

@Entity('documents')
@Index([
  'documentable_id',
  'documentable_type',
])
export class DocumentEntity extends BaseModelEntity implements Document  {
  @Column({ length: 1000 })
  description: string;

  @Column({
    length: 1000,
    nullable: true,
  })
  fileLocation: string;

  @Column({ length: 1000 })
  title: string;

  @Column({
    default: DocumentEntity.name,
    nullable: false,
  })
  entity_type: string

  @Column()
  @Index()
  author_id: string;

  @ManyToOne(() => ProfileEntity, { eager: true })
  author: ProfileEntity

  @Column({ nullable: true })
  documentable_id: string;

  @Column({ nullable: true })
  documentable_type: string;

  @OneToMany(() => CommentEntity, (comment) => comment.document, {
    createForeignKeyConstraints: false,
    nullable: true,
    eager: true,
  })
  comments: CommentEntity[]

  @ManyToOne(() => BoatEntity, () => null, { createForeignKeyConstraints: false })
  @JoinColumn([
    {
      name: 'documentable_id',
      referencedColumnName: 'id',
    },
    {
      name: 'documentable_type',
      referencedColumnName: 'entity_type',
    },
  ])
  boat: BoatEntity

  @ManyToOne(() => ClinicEntity, () => null, { createForeignKeyConstraints: false })
  @JoinColumn([
    {
      name: 'documentable_id',
      referencedColumnName: 'id',
    },
    {
      name: 'documentable_type',
      referencedColumnName: 'entity_type',
    },
  ])
  clinic: ClinicEntity

  @ManyToOne(() => ChallengeEntity, () => null, { createForeignKeyConstraints: false })
  @JoinColumn([
    {
      name: 'documentable_id',
      referencedColumnName: 'id',
    },
    {
      name: 'documentable_type',
      referencedColumnName: 'entity_type',
    },
  ])
  challenge: ChallengeEntity
}
