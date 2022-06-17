import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { BoatChecklist } from '../types/boat-checklist/boat-checklist';
import { BoatChecklistItem } from '../types/boat-checklist/boat-checklist-item';
import { BoatEntity } from '../boat/boat.entity';

@Entity('boat_checklists')
export class BoatChecklistEntity extends BaseModelEntity implements BoatChecklist {
  @OneToOne(() => BoatEntity, boat => boat.checklist, { eager: false })
  @JoinColumn()
    boat: BoatEntity;

  @Column()
  @Index()
    boatId: string;

  @Column({
    default: [],
    type: 'json',
  })
    items: BoatChecklistItem[];
}
