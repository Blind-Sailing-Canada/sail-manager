import {
  Column,
  Entity,
  ManyToOne,
  Unique
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { SailEntity } from '../sail/sail.entity';
import { BilgeState } from '../types/sail-checklist/bilge-state';
import { FireExtinguisherState } from '../types/sail-checklist/fire-exstinguisher-state';
import { FlaresState } from '../types/sail-checklist/flare-state';
import { FuelState } from '../types/sail-checklist/fuel-state';
import { SailChecklist } from '../types/sail-checklist/sail-checklist';
import { SailChecklistType } from '../types/sail-checklist/sail-checklist-type';

@Entity('sail_checklists')
@Unique('sail_id_checklist_type', [
  'sail_id',
  'checklist_type',
])
export class SailChecklistEntity extends BaseModelEntity implements SailChecklist {
  @Column({
    nullable: true,
    default: false,
  })
  signed_by_crew: boolean;

  @Column({
    nullable: true,
    default: '',
  })
  comments: string;

  @Column({
    nullable: true,
    default: false,
  })
  signed_by_skipper: boolean;

  @Column({
    default: SailChecklistType.Before,
    enum: SailChecklistType,
    type: 'enum',
    nullable: true,
  })
  checklist_type: SailChecklistType;

  @Column({
    nullable: true,
    default: null,
  })
  sail_destination: string;

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
  fire_extinguisher: FireExtinguisherState;

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
  sail_id: string;

  @ManyToOne(() => SailEntity, (sail) => sail.feedback)
  sail: SailEntity;

  @Column({
    nullable: true,
    default: null,
  })
  submitted_by_id: string;

  @ManyToOne(() => ProfileEntity, (profile) => profile.sail_checklists, { eager: true })
  submitted_by: ProfileEntity;
}
