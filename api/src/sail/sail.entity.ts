import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne
} from 'typeorm';
import { CreatedByBaseModelEntity } from '../base/created-by-base.entity';
import { BoatEntity } from '../boat/boat.entity';
import { CommentEntity } from '../comment/comment.entity';
import { MediaEntity } from '../media/media.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { SailChecklistEntity } from '../sail-checklist/sail-checklist.entity';
import { SailFeedbackEntity } from '../sail-feedback/sail-feedback.entity';
import { SailManifestEntity } from '../sail-manifest/sail-manifest.entity';
import { SailRequestEntity } from '../sail-request/sail-request.entity';
import { Sail } from '../types/sail/sail';
import { SailStatus } from '../types/sail/sail-status';

@Entity('sails')
@Index([
  'id',
  'entity_type',
])
export class SailEntity extends CreatedByBaseModelEntity implements Sail {

  @Column({
    nullable: true,
    unique: true,
  })
    entity_number: number;

  @Column({
    default: '',
    length: 100,
  })
  @Index()
    name: string;

  @Column({
    nullable: true,
    default: false,
  })
    is_payment_free: boolean;

  @Column({
    nullable: true,
    default: null,
  })
    calendar_id: string;

  @Column({
    nullable: true,
    default: null,
  })
    calendar_link: string;

  @Column({
    length: 500,
    nullable: true,
    default: 'other',
  })
  @Index('sails_category')
    category: string;

  @Column({
    length: 500,
    nullable: true,
  })
  @Index('sails_description')
    description: string;

  @Column({
    default: SailStatus.New,
    enum: SailStatus,
    type: 'enum',
    nullable: false,
  })
  @Index()
    status: SailStatus;

  @Column({
    nullable: false,
    type: 'timestamptz',
  })
  @Index()
    start_at: Date;

  @Column({
    nullable: false,
    type: 'timestamptz',
  })
  @Index()
    end_at: Date;

  @Column({ default: 6 })
    max_occupancy: number;

  @Column({ nullable: true })
    cancel_reason: string;

  @Column({ nullable: true })
    cancelled_by_id: string;

  @Column({
    default: SailEntity.name,
    nullable: false,
  })
  @Index()
    entity_type: string;

  @ManyToOne(() => ProfileEntity, undefined, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({
    name: 'cancelled_by_id',
    referencedColumnName: 'id',
  })
    cancelled_by: ProfileEntity;

  @Column({
    nullable: true,
    type: 'timestamptz',
  })
    cancelled_at: Date;

  @Column({ type: 'uuid' })
  @Index()
    boat_id: string;

  @ManyToOne(() => BoatEntity, boat => boat.sails, { eager: true })
    boat: BoatEntity;

  @OneToMany(() => SailManifestEntity, manifest => manifest.sail, { eager: true })
    manifest: SailManifestEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.sail, {
    createForeignKeyConstraints: false,
    nullable: true,
    eager: false,
  })
    comments: CommentEntity[];

  @OneToMany(() => SailFeedbackEntity, (feedback) => feedback.sail)
    feedback: SailFeedbackEntity[];

  @OneToMany(() => SailChecklistEntity, (checklist) => checklist.sail, { eager: false })
    checklists: SailChecklistEntity[];

  @Column({
    nullable: true,
    default: null,
    type: 'uuid'
  })
  @Index()
    sail_request_id: string;

  @OneToOne(() => SailRequestEntity, { nullable: true })
    sail_request: SailRequestEntity;

  @OneToMany(() => MediaEntity, (picture) => picture.sail, {
    createForeignKeyConstraints: false,
    nullable: true,
    eager: false,
  })
    pictures: MediaEntity[];

  @BeforeInsert()
  async addEntityNumber() {
    const tableName = `${SailEntity.getRepository().metadata.tableName}`;

    const entity_number = await SailEntity
      .getRepository()
      .createQueryBuilder(tableName)
      .select(`MAX(${tableName}.entity_number)`, 'max')
      .getRawOne();

    const sailNumber = entity_number.max + 1;

    this.entity_number = sailNumber;

    if (!`${this.name || ''}`.trim()) {
      this.name = `Sail #${sailNumber}`;
    }
  }
}
