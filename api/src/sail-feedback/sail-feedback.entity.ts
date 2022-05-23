import {
  Column,
  Entity,
  Index,
  ManyToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { SailEntity } from '../sail/sail.entity';
import { SailFeedback } from '../types/sail-feedback/sail-feedback';
import { Sail } from '../types/sail/sail';

@Entity('sail_feedback')
@Index(['id'])
export class SailFeedbackEntity extends BaseModelEntity implements SailFeedback {
  @Column({
    nullable: true,
    default: null,
  })
  feedback: string;

  @Column()
  rating: number;

  @Column()
  @Index()
  sail_id: string;

  @ManyToOne(() => SailEntity, (sail) => sail.feedback)
  sail: Sail;
}
