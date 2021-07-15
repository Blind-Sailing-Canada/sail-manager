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
import { BaseModelEntity } from '../base/base.entity';
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

@Entity('sail')
@Index([
  'id',
  'entityType',
])
export class SailEntity extends BaseModelEntity implements Sail {

  @Column({
    nullable: true,
    unique: true,
  })
  entityNumber: number;

  @Column({
    default: '',
    length: 100,
  })
  @Index()
  name: string;

  @Column({
    nullable: true,
    default: null,
  })
  calendarId: string;

  @Column({
    nullable: true,
    default: null,
  })
  calendarLink: string;

  @Column({
    length: 500,
    nullable: true,
  })
  @Index('sail_description')
  description: string;

  @Column({
    default: SailStatus.New,
    enum: SailStatus,
    type: 'enum',
    nullable: false,
  })
  @Index()
  status: SailStatus

  @Column({ nullable: false })
  @Index()
  start: Date;

  @Column({ nullable: false })
  @Index()
  end: Date;

  @Column({ default: 6 })
  maxOccupancy: number;

  @Column({ nullable: true })
  cancelReason: string;

  @Column({ nullable: true })
  cancelledById: string;

  @Column({
    default: SailEntity.name,
    nullable: false,
  })
  @Index()
  entityType: string;

  @ManyToOne(() => ProfileEntity, undefined, {
    nullable: true,
    primary: false,
    eager: true,
  })
  @JoinColumn()
  cancelledBy: ProfileEntity;

  @Column({ nullable: true })
  cancelledAt: Date;

  @Column()
  boatId: string;

  @ManyToOne(() => BoatEntity, boat => boat.sails, { eager: true })
  @Index()
  boat: BoatEntity;

  @OneToMany(() => SailManifestEntity, manifest => manifest.sail, { eager: true })
  manifest: SailManifestEntity[]

  @OneToMany(() => CommentEntity, (comment) => comment.sail, {
    createForeignKeyConstraints: false,
    nullable: true,
    eager: true,
  })
  comments: CommentEntity[]

  @OneToMany(() => SailFeedbackEntity, (feedback) => feedback.sail)
  feedback: SailFeedbackEntity[];

  @OneToMany(() => SailChecklistEntity, (checklist) => checklist.sail, { eager: true })
  checklists: SailChecklistEntity[];

  @Column({
    nullable: true,
    default: null,
  })
  sailRequestId: string;

  @OneToOne(() => SailRequestEntity, { nullable: true })
  sailRequest: SailRequestEntity;

  @OneToMany(() => MediaEntity, (picture) => picture.sail, {
    createForeignKeyConstraints: false,
    nullable: true,
    eager: true,
  })
  pictures: MediaEntity[];

  @BeforeInsert()
  async addEntityNumber() {
    const tableName = `"${SailEntity.getRepository().metadata.tableName}"`;

    const entityNumber = await SailEntity
      .getRepository()
      .createQueryBuilder(tableName)
      .select(`MAX(${tableName}.entityNumber)`, 'max')
      .getRawOne();

    const sailNumber = entityNumber.max + 1;

    this.entityNumber = sailNumber;

    if (!`${this.name || ''}`.trim()) {
      this.name = `Sail #${sailNumber}`;
    }
  }
}
