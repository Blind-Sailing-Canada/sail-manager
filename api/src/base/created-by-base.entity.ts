import {
  Column, JoinColumn, ManyToOne
} from 'typeorm';
import { Profile } from '../types/profile/profile';
import { BaseModelEntity } from './base.entity';

export class CreatedByBaseModelEntity extends BaseModelEntity {
  @Column({
    default: null,
    nullable: true,
    type: 'uuid'
  })
    created_by_id: string;

  @ManyToOne('ProfileEntity', {
    nullable: true,
    eager: false,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({
    name: 'created_by_id',
    referencedColumnName: 'id',
  })
    created_by: Profile;
}
