import { BoatInstructions } from '../../../../api/src/types/boat-instructions/boat-instructions';

export interface InstructionsMap {
  [prop: string]: BoatInstructions;
}
export interface InstructionsState {
  [prop: string]: InstructionsMap;
}
