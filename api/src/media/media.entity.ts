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
import { Media } from '../types/media/media';
import { MediaType } from '../types/media/media-type';

@Entity('media')
export class MediaEntity extends BaseModelEntity implements Media {
  @Column()
  url: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  mediaForId: string;

  @Column({ nullable: true })
  mediaForType: string;

  @Column({
    default: MediaType.Picture,
    enum: MediaType,
    type: 'enum',
    nullable: false,
  })
  @Index('media_type')
  mediaType: MediaType;

  @Column()
  postedById: string;

  @Column({ nullable: true })
  title: string;

  @ManyToOne(() => ProfileEntity, { eager: true })
  postedBy: ProfileEntity;

  @ManyToOne(() => BoatMaintenanceEntity, () => null, { createForeignKeyConstraints: false })
  @JoinColumn([
    {
      name: 'mediaForId',
      referencedColumnName: 'id',
    },
    {
      name: 'mediaForType',
      referencedColumnName: 'entityType',
    },
  ])
  boatMaintenance: BoatMaintenanceEntity

  @ManyToOne(() => BoatMaintenanceEntity, () => null, { createForeignKeyConstraints: false })
  @JoinColumn([
    {
      name: 'mediaForId',
      referencedColumnName: 'id',
    },
    {
      name: 'mediaForType',
      referencedColumnName: 'entityType',
    },
  ])
  challenge: ChallengeEntity;

  @ManyToOne(() => SailEntity, () => null, { createForeignKeyConstraints: false })
  @JoinColumn([
    {
      name: 'mediaForId',
      referencedColumnName: 'id',
    },
    {
      name: 'mediaForType',
      referencedColumnName: 'entityType',
    },
  ])
  sail: SailEntity;
}
