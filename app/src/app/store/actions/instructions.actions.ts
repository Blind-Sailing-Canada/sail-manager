import {
  createAction,
  props,
} from '@ngrx/store';
import { BoatInstructions } from '../../../../../api/src/types/boat-instructions/boat-instructions';

export enum INSTRUCTIONS_ACTION_TYPES {
  CREATE_INSTRUCTIONS = '[Instructions] Create',
  FETCH_INSTRUCTIONS_BY_BOAT = '[Instructions] Fetch by Boat',
  FETCH_INSTRUCTIONS_BY_TYPE = '[Instructions] Fetch by Type',
  PUT_INSTRUCTIONS = '[Instructions] Put',
  RESET = 'Reset',
  UPDATE_INSTRUCTIONS = '[Instructions] Update',
  UPDATE_BOAT_INSTRUCTIONS = '[Instructions] Update boat instructions',
}
export const createInstructions = createAction(
  INSTRUCTIONS_ACTION_TYPES.CREATE_INSTRUCTIONS, props<{ instructions: any, notify?: boolean }>());
export const fetchInstructionByBoat = createAction(INSTRUCTIONS_ACTION_TYPES.FETCH_INSTRUCTIONS_BY_BOAT, props<{ boatId: string }>());
export const fetchInstructionByType = createAction(
  INSTRUCTIONS_ACTION_TYPES.FETCH_INSTRUCTIONS_BY_TYPE, props<{ boatId: string, instructionsType: any }>());
export const putInstructions = createAction(
  INSTRUCTIONS_ACTION_TYPES.PUT_INSTRUCTIONS, props<{ instructions: any | any[] }>());
export const resetInstructions = createAction(INSTRUCTIONS_ACTION_TYPES.RESET);
export const updateInstructions = createAction(
  INSTRUCTIONS_ACTION_TYPES.UPDATE_INSTRUCTIONS, props<{ id: string, instructions: any, notify?: boolean }>());
export const updateBoatInstructions = createAction(
  INSTRUCTIONS_ACTION_TYPES.UPDATE_BOAT_INSTRUCTIONS,
  props<{ boatId: string, instructions: { [instructionId: string]: Partial<BoatInstructions> }, notify?: boolean }>());
