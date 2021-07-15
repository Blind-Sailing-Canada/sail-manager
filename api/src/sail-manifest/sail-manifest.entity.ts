import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { SailEntity } from '../sail/sail.entity';
import { SailManifest } from '../types/sail-manifest/sail-manifest';
import { SailorRole } from '../types/sail-manifest/sailor-role';

@Entity('sail-manifest')
@Index('sail-profile-index', [
  'sailId',
  'profileId',
], { unique: true })
export class SailManifestEntity extends BaseModelEntity implements SailManifest {
  @Column({ nullable: false })
  @Index()
  sailId: string;

  @ManyToOne(() => SailEntity, sail => sail.manifest)
  sail: SailEntity

  @Column({ nullable: true })
  @Index()
  profileId: string;

  @Column({ nullable: false })
  @Index()
  personName: string;

  @Column({
    nullable: false,
    default: false,
  })
  attended: boolean;

  @Column({
    nullable: true,
    default: null,
  })
  guestOfId: string;

  @ManyToOne(() => ProfileEntity, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({
    name: 'guestOfId',
    referencedColumnName: 'id',
  })
  guestOf: ProfileEntity;

  @ManyToOne(() => ProfileEntity, { eager: true })
  @JoinColumn({
    name: 'profileId',
    referencedColumnName: 'id',
  })
  profile: ProfileEntity;

  @Column({
    default: SailorRole.Guest,
    enum: SailorRole,
    type:  'enum',
  })
  sailorRole: SailorRole;

}
