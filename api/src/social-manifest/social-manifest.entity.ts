import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { SocialEntity } from '../social/social.entity';
import { SocialManifest } from '../types/social-manifest/social-manifest';

@Entity('social_manifests')
@Index('social-profile-index', [
  'social_id',
  'profile_id',
], { unique: true })
export class SocialManifestEntity extends BaseModelEntity implements SocialManifest {
  @Column({
    nullable: false,
    type: 'uuid'
  })
  @Index()
    social_id: string;

  @ManyToOne(() => SocialEntity, social => social.manifest)
    social: SocialEntity;

  @Column({
    nullable: true,
    type: 'uuid'
  })
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
    type: 'uuid',
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

}
