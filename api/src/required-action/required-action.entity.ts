import {
  Column,
  Entity,
  ManyToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { RequiredAction } from '../types/required-action/required-action';
import { RequiredActionStatus } from '../types/required-action/required-action-status';
import { RequiredActionType } from '../types/required-action/required-action-type';

@Entity('required_actions')
export class RequiredActionEntity extends BaseModelEntity implements RequiredAction {
  @Column()
    title: string;

  @Column({
    nullable: true,
    default: null,
  })
    details: string;

  @Column({ type: 'uuid' })
    actionable_id: string;

  @Column()
    actionable_type: string;

  @Column({
    nullable: true,
    default: null,
    type: 'uuid'
  })
    assigned_by_id: string;

  @Column({ type: 'uuid' })
    assigned_to_id: string;

  @Column({
    nullable: true,
    default: null,
    type: 'timestamptz',
  })
    due_date: Date;

  @Column({
    default: RequiredActionType.ReviewNewUser,
    enum: RequiredActionType,
    type: 'enum',
    nullable: false,
  })
    required_action_type: RequiredActionType;

  @Column({
    default: RequiredActionStatus.New,
    enum: RequiredActionStatus,
    type: 'enum',
    nullable: false,
  })
    status: RequiredActionStatus;

  @ManyToOne(() => ProfileEntity)
    assigned_by: ProfileEntity;

  @ManyToOne(() => ProfileEntity)
    assigned_to: ProfileEntity;
}
