import {
  Column,
  Entity,
  Index,
  ManyToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { BoatEntity } from '../boat/boat.entity';
import { BoatInstruction } from '../types/boat-instructions/boat-instruction';
import { BoatInstructions } from '../types/boat-instructions/boat-instructions';
import { BoatInstructionType } from '../types/boat-instructions/boat-instruction-type';

@Entity('boat_instructions')
export class BoatInstructionsEntity extends BaseModelEntity implements BoatInstructions {

  @Column({ type: 'uuid' })
  @Index()
    boat_id: string;

  @ManyToOne(() => BoatEntity, (boat) => boat.instructions)
    boat: BoatEntity;

  @Column()
    description: string;

  @Column()
    instruction_type: BoatInstructionType;

  @Column({
    type: 'jsonb',
    array: false,
    default: [],
    nullable: false,
  })
    instructions: BoatInstruction[];

  @Column()
    title: string;
}
