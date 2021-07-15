import {
  createAction,
  props,
} from '@ngrx/store';
import { Snack } from '../../models/snack-state.interface';

export enum SNACK_ACTION_TYPES {
  PUT_ONE = '[Snack] Put One',
  REMOVE_ONE = '[Snack] Remove One',
  RESET = '2Reset',
}

export const putSnack = createAction(SNACK_ACTION_TYPES.PUT_ONE, props<{ snack: Snack }>());
export const removeSnack = createAction(SNACK_ACTION_TYPES.REMOVE_ONE, props<{ index: number }>());
export const resetSnacks = createAction(SNACK_ACTION_TYPES.RESET);
