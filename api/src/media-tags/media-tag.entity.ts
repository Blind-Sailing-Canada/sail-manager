import {
  Column,
  Entity,
  ManyToOne,
  Unique
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { MediaEntity } from '../media/media.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { MediaTag } from '../types/media-tag/media-tag';
import { Media } from '../types/media/media';

@Entity('media-tag')
@Unique('media_id_profile_id', [
  'profile_id',
  'media_id',
])
export class MediaTagEntity extends BaseModelEntity implements MediaTag {
  @Column({ type: 'uuid' })
    profile_id: string;
  @ManyToOne(() => ProfileEntity, {
    eager: true,
    onDelete: 'CASCADE'
  })
    profile: ProfileEntity;
  @ManyToOne(() => MediaEntity, (media) => media.tags, {
    eager: false,
    onDelete: 'CASCADE'
  })
    media: Media;
  @Column({ type: 'uuid' })
    media_id: string;
  @Column({ default: 0 })
    x1: number;
  @Column({ default: 0 })
    x2: number;
  @Column({ default: 0 })
    y1: number;
  @Column({ default: 0 })
    y2: number;
}

