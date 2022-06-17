import {
  Column,
  Entity
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { SailCategory } from '../types/sail/sail-category';

@Entity('sail_categories')
export class SailCategoryEntity extends BaseModelEntity implements SailCategory {
  @Column({
    nullable: false,
    unique: true,
  })
    category: string;
}
