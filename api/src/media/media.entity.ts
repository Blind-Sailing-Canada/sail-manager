import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { BoatMaintenanceEntity } from '../boat-maintenance/boat-maintenance.entity';
import { ChallengeEntity } from '../challenge/challenge.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { SailEntity } from '../sail/sail.entity';
import { SocialEntity } from '../social/social.entity';
import { Media } from '../types/media/media';
import { MediaType } from '../types/media/media-type';

@Entity('media')
export class MediaEntity extends BaseModelEntity implements Media {
  @Column()
    url: string;

  @Column({ nullable: true })
    description: string;

  @Column({
    nullable: true,
    type: 'uuid'
  })
    media_for_id: string;

  @Column({ nullable: true })
    media_for_type: string;

  @Column({
    default: MediaType.Picture,
    enum: MediaType,
    type: 'enum',
    nullable: false,
  })
  @Index('media_type')
    media_type: MediaType;

  @Column({ type: 'uuid' })
    posted_by_id: string;

  @Column({ nullable: true })
    title: string;

  @ManyToOne(() => ProfileEntity, { eager: true })
    posted_by: ProfileEntity;

  @ManyToOne(() => BoatMaintenanceEntity, () => null, { createForeignKeyConstraints: false })
  @JoinColumn([
    {
      name: 'media_for_id',
      referencedColumnName: 'id',
    },
    {
      name: 'media_for_type',
      referencedColumnName: 'entity_type',
    },
  ])
    boatMaintenance: BoatMaintenanceEntity;

  @ManyToOne(() => BoatMaintenanceEntity, () => null, { createForeignKeyConstraints: false })
  @JoinColumn([
    {
      name: 'media_for_id',
      referencedColumnName: 'id',
    },
    {
      name: 'media_for_type',
      referencedColumnName: 'entity_type',
    },
  ])
    challenge: ChallengeEntity;

  @ManyToOne(() => SailEntity, () => null, { createForeignKeyConstraints: false })
  @JoinColumn([
    {
      name: 'media_for_id',
      referencedColumnName: 'id',
    },
    {
      name: 'media_for_type',
      referencedColumnName: 'entity_type',
    },
  ])
    sail: SailEntity;

  @ManyToOne(() => SocialEntity, () => null, { createForeignKeyConstraints: false })
  @JoinColumn([
    {
      name: 'media_for_id',
      referencedColumnName: 'id',
    },
    {
      name: 'media_for_type',
      referencedColumnName: 'entity_type',
    },
  ])
    social: SocialEntity;
}
