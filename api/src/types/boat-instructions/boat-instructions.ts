import { Base } from '../base/base';
import { Boat } from '../boat/boat';
import { BoatInstruction } from './boat-instruction';
import { BoatInstructionType } from './boat-instruction-type';

export interface BoatInstructions extends Base {
  boat: Boat;
  boatId: string;
  description: string;
  instructionType: BoatInstructionType;
  instructions: BoatInstruction[];
  title: string;
}
