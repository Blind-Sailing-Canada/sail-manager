import {
  AfterInsert,
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { Boat } from '../types/boat/boat';
import { BoatChecklist } from '../types/boat-checklist/boat-checklist';
import { BoatChecklistEntity } from '../boat-checklist/boat-checklist.entity';
import { BoatInstructionType } from '../types/boat-instructions/boat-instruction-type';
import { BoatInstructions } from '../types/boat-instructions/boat-instructions';
import { BoatInstructionsEntity } from '../boat-instructions/boat-instructions.entity';
import { BoatStatus } from '../types/boat/boat-status';
import { DocumentEntity } from '../document/document.entity';
import { SailEntity } from '../sail/sail.entity';

@Entity('boats')
export class BoatEntity extends BaseModelEntity implements Boat {
  @Column({
    length: 100,
    unique: true,
    nullable: false,
  })
  @Index('boat_name')
  name: string;

  @Column({
    nullable: true,
    default: null,
  })
  calendar_resource_id: string;

  @Column({
    default: BoatStatus.OutOfService,
    enum: BoatStatus,
    type: 'enum',
    nullable: false,
  })
  @Index('boat_status')
  status: BoatStatus;

  @Column({ default: 6 })
  max_occupancy: number;

  @Column({ length: 50 })
  draft: string;

  @Column({ length: 50 })
  loa: string;

  @Column({ length: 50 })
  lwl: string;

  @Column({ length: 50 })
  hull_type: string;

  @Column({ length: 50 })
  material: string;

  @Column({ length: 50 })
  beam: string;

  @Column({ length: 50 })
  ballast: string;

  @Column({ length: 50 })
  rig: string;

  @Column({ length: 50 })
  main_sail_area: string;

  @Column({ length: 50 })
  jib_sail_area: string;

  @Column({ length: 50 })
  phrf: string;

  @Column({
    nullable: true,
    default: null,
  })
  wiki: string;

  @Column({
    default: BoatEntity.name,
    nullable: false,
  })
  @Index()
  entity_type: string

  @OneToMany(() => SailEntity, sail => sail.boat, { eager: false })
  sails: SailEntity[]

  @OneToMany(() => BoatInstructionsEntity, instructions => instructions.boat, { eager: true })
  instructions: BoatInstructions[]

  @OneToOne(() => BoatChecklistEntity, (checklist) => checklist.boat, {
    eager: true,
    nullable: true,
  })
  checklist: BoatChecklist

  @Column({
    type: 'jsonb',
    array: false,
    default: [],
    nullable: false,
  })
  pictures: string[];

  @OneToMany(() => DocumentEntity, (document) => document.boat, {
    createForeignKeyConstraints: false,
    nullable: true,
    eager: false,
  })
  documents: DocumentEntity[]

  @AfterInsert()
  createChecklist() {
    const checklist = BoatChecklistEntity.create({
      boatId: this.id,
      items: [],
    });

    checklist.save();
  }

  @AfterInsert()
  createInstructions() {
    const departure = BoatInstructionsEntity.create({
      boat_id: this.id,
      instruction_type: BoatInstructionType.Departure,
      instructions: [],
      title: 'On Departure',
      description: 'Follow these instructions before leaving the dock.',
    });

    const arrival = BoatInstructionsEntity.create({
      boat_id: this.id,
      instruction_type: BoatInstructionType.Arrival,
      instructions: [],
      title: 'On Arrival',
      description: 'Follow these instructions after docking.',
    });

    BoatInstructionsEntity.save([
      departure,
      arrival,
    ]);
  }
}
