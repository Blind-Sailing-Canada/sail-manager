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
  'sail_id',
  'profile_id',
], { unique: true })
export class SailManifestEntity extends BaseModelEntity implements SailManifest {
  @Column({ nullable: false })
  @Index()
  sail_id: string;

  @ManyToOne(() => SailEntity, sail => sail.manifest)
  sail: SailEntity

  @Column({ nullable: true })
  @Index()
  profile_id: string;

  @Column({ nullable: false })
  @Index()
  person_name: string;

  @Column({
    nullable: false,
    default: false,
  })
  attended: boolean;

  @Column({
    nullable: true,
    default: null,
  })
  guest_of_id: string;

  @ManyToOne(() => ProfileEntity, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({
    name: 'guest_of_id',
    referencedColumnName: 'id',
  })
  guest_of: ProfileEntity;

  @ManyToOne(() => ProfileEntity, { eager: true })
  @JoinColumn({
    name: 'profile_id',
    referencedColumnName: 'id',
  })
  profile: ProfileEntity;

  @Column({
    default: SailorRole.Guest,
    enum: SailorRole,
    type:  'enum',
  })
  sailor_role: SailorRole;

}
