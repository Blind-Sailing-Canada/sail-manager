import {
  Column,
  Entity,
  ManyToOne,
  Unique
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { SailEntity } from '../sail/sail.entity';
import { BilgeState } from '../types/sail-checklist/bilge-state';
import { FireExtinguisherState } from '../types/sail-checklist/fire-exstinguisher-state';
import { FlaresState } from '../types/sail-checklist/flare-state';
import { FuelState } from '../types/sail-checklist/fuel-state';
import { SailChecklist } from '../types/sail-checklist/sail-checklist';
import { SailChecklistType } from '../types/sail-checklist/sail-checklist-type';

@Entity('sail-checklist')
@Unique('sail_id_checklist_type', [
  'sailId',
  'checklistType',
])
export class SailChecklistEntity extends BaseModelEntity implements SailChecklist {
  @Column({
    nullable: true,
    default: false,
  })
  signedByCrew: boolean;

  @Column({
    nullable: true,
    default: '',
  })
  comments: string;

  @Column({
    nullable: true,
    default: false,
  })
  signedBySkipper: boolean;

  @Column({
    default: SailChecklistType.Before,
    enum: SailChecklistType,
    type: 'enum',
    nullable: true,
  })
  checklistType: SailChecklistType;

  @Column({
    nullable: true,
    default: null,
  })
  sailDestination: string;

  @Column({
    nullable: true,
    default: null,
  })
  weather: string;

  @Column({
    default: BilgeState.DID_NOT_CHECK,
    enum: BilgeState,
    type: 'enum',
    nullable: true,
  })
  bilge: BilgeState;

  @Column({
    default: FireExtinguisherState.DID_NOT_CHECK,
    enum: FireExtinguisherState,
    type: 'enum',
    nullable: true,
  })
  fireExtinguisher: FireExtinguisherState;

  @Column({
    default: FlaresState.DID_NOT_CHECK,
    enum: FlaresState,
    type: 'enum',
    nullable: true,
  })
  flares: FlaresState;

  @Column({
    default: FuelState.DID_NOT_CHECK,
    enum: FuelState,
    type: 'enum',
    nullable: true,
  })
  fuel: FuelState;

  @Column()
  sailId: string;

  @ManyToOne(() => SailEntity, (sail) => sail.feedback)
  sail: SailEntity;
}
