import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BaseModelEntity } from '../../base/base.entity';
import { ProfileEntity } from '../../profile/profile.entity';
import { Profile } from '../../types/profile/profile';
import { SavedQuery } from '../../types/saved-query/saved-query';

@Entity('saved-queries')
@Index(['id'])
export class SavedQueryEntity extends BaseModelEntity implements SavedQuery {
  @Column({
    default: '',
    length: 200,
  })
  @Index('saved_query_name', {
    unique: true,
    where: 'deleted_at IS NULL'
  })
    name: string;

  @Column({ nullable: false, })
    query: string;

  @Column({ nullable: false, })
    created_by_id: string;

  @ManyToOne(() => ProfileEntity, undefined, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({
    name: 'created_by_id',
    referencedColumnName: 'id',
  })
    created_by: Profile;

  @DeleteDateColumn()
    deleted_at?: Date;
}

