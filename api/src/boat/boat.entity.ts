import {
  AfterInsert,
  Column,
  Entity,
  Index,
  OneToMany
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { BoatInstructionsEntity } from '../boat-instructions/boat-instructions.entity';
import { BoatInstructions } from '../types/boat-instructions/boat-instructions';
import { SailEntity } from '../sail/sail.entity';
import { Boat } from '../types/boat/boat';
import { BoatStatus } from '../types/boat/boat-status';
import { BoatInstructionType } from '../types/boat-instructions/boat-instruction-type';

@Entity('boat')
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

  @Column()
  wiki: string;

  @Column({
    default: BoatEntity.name,
    nullable: false,
  })
  entity_type: string

  @OneToMany(() => SailEntity, sail => sail.boat)
  sails: SailEntity[]

  @OneToMany(() => BoatInstructionsEntity, (instructions) => instructions.boat, { eager: true })
  instructions: BoatInstructions[]

  @Column({
    type: 'jsonb',
    array: false,
    default: [],
    nullable: false,
  })
  pictures: string[];

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
