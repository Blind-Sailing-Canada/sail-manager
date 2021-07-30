import {
  Column,
  Entity,
  ManyToOne
} from 'typeorm';
import { BaseModelEntity } from '../base/base.entity';
import { BoatEntity } from '../boat/boat.entity';
import { BoatInstruction } from '../types/boat-instructions/boat-instruction';
import { BoatInstructions } from '../types/boat-instructions/boat-instructions';
import { BoatInstructionType } from '../types/boat-instructions/boat-instruction-type';

@Entity('boat-instructions')
export class BoatInstructionsEntity extends BaseModelEntity implements BoatInstructions {

  @ManyToOne(() => BoatEntity, (boat) => boat.instructions)
  boat: BoatEntity;

  @Column()
  boat_id: string;

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
