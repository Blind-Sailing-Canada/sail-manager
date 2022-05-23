import {
  Column,
  Entity,
  Index,
  ManyToOne,
  Unique
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { ProfileEntity } from '../profile/profile.entity';
import { SailEntity } from '../sail/sail.entity';
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
    nullable: false,
    type: 'json',
    default: {},
  })
  checklist: Map<string, string>

  @Column()
  @Index()
  sail_id: string;

  @ManyToOne(() => SailEntity, (sail) => sail.feedback)
  sail: SailEntity;

  @Column({
    nullable: true,
    default: null,
  })
  @Index()
  submitted_by_id: string;

  @ManyToOne(() => ProfileEntity, (profile) => profile.sail_checklists, { eager: true })
  submitted_by: ProfileEntity;
}
