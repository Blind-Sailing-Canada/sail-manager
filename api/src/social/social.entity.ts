import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CreatedByBaseModelEntity } from '../base/created-by-base.entity';
import { CommentEntity } from '../comment/comment.entity';
import { MediaEntity } from '../media/media.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { SocialManifestEntity } from '../social-manifest/social-manifest.entity';
import { Social } from '../types/social/social';
import { SocialStatus } from '../types/social/social-status';

@Entity('socials')
@Index([
  'id',
  'entity_type',
])
export class SocialEntity extends CreatedByBaseModelEntity implements Social {

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
    default: '',
    length: 500,
    nullable: true,
  })
  @Index()
    address: string;

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
  })
    description: string;

  @Column({
    default: SocialStatus.New,
    enum: SocialStatus,
    type: 'enum',
    nullable: false,
  })
  @Index()
    status: SocialStatus;

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

  @Column({ default: -1 })
    max_attendants: number;

  @Column({ nullable: true })
    cancel_reason: string;

  @Column({
    nullable: true,
    type: 'uuid'
  })
    cancelled_by_id: string;

  @Column({
    default: SocialEntity.name,
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

  @OneToMany(() => SocialManifestEntity, manifest => manifest.social, { eager: true })
    manifest: SocialManifestEntity[];

  @OneToMany(() => CommentEntity, comment => comment.social, {
    createForeignKeyConstraints: false,
    nullable: true,
    eager: true,
  })
    comments: CommentEntity[];

  @OneToMany(() => MediaEntity, (media) => media.social, {
    createForeignKeyConstraints: false,
    nullable: true,
    eager: false,
  })
    pictures: MediaEntity[];

  @BeforeInsert()
  async addEntityNumber() {
    const tableName = `${SocialEntity.getRepository().metadata.tableName}`;

    const entity_number = await SocialEntity
      .getRepository()
      .createQueryBuilder(tableName)
      .select(`MAX(${tableName}.entity_number)`, 'max')
      .getRawOne();

    const sailNumber = entity_number.max + 1;

    this.entity_number = sailNumber;

    if (!`${this.name || ''}`.trim()) {
      this.name = `Social #${sailNumber}`;
    }
  }
}
