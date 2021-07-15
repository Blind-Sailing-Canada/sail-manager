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

@Entity('required-action')
export class RequiredActionEntity extends BaseModelEntity implements RequiredAction {
  @Column()
  title: string;

  @Column({
    nullable: true,
    default: null,
  })
  details: string;

  @Column()
  actionableId: string;

  @Column()
  actionableType: string;

  @Column({
    nullable: true,
    default: null,
  })
  assignedById: string;

  @Column()
  assignedToId: string;

  @Column({
    nullable: true,
    default: null,
  })
  dueDate: Date;

  @Column({
    default: RequiredActionType.ReviewNewUser,
    enum: RequiredActionType,
    type: 'enum',
    nullable: false,
  })
  requiredActionType: RequiredActionType;

  @Column({
    default: RequiredActionStatus.New,
    enum: RequiredActionStatus,
    type: 'enum',
    nullable: false,
  })
  status: RequiredActionStatus;

  @ManyToOne(() => ProfileEntity)
  assignedBy: ProfileEntity;

  @ManyToOne(() => ProfileEntity)
  assignedTo: ProfileEntity;
}
