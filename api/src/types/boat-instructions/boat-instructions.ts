import { Base } from '../base/base';
import { Boat } from '../boat/boat';
import { BoatInstruction } from './boat-instruction';
import { BoatInstructionType } from './boat-instruction-type';

export interface BoatInstructions extends Base {
  boat: Boat;
  boat_id: string;
  description: string;
  instruction_type: BoatInstructionType;
  instructions: BoatInstruction[];
  title: string;
}
