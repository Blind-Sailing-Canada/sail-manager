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
  boatId: string;

  @Column()
  description: string;

  @Column()
  instructionType: BoatInstructionType;

  @Column({
    type: 'json',
    array: false,
    default: () => '("[]")',
    nullable: false,
  })
  instructions: BoatInstruction[];

  @Column()
  title: string;
}
