import {
  createAction,
  props,
} from '@ngrx/store';
import { Boat } from '../../../../../api/src/types/boat/boat';

export enum BOAT_ACTION_TYPES {
  CREATE = '[Boat] Create',
  UPDATE = '[Boat] Update',
  FETCH_MANY = '[Boat] Fetch Many',
  FETCH_ONE = '[Boat] Fetch One',
  PUT_MANY = '[Boat] Put Many',
  PUT_ONE = '[Boat] Put One',
  RESET = 'Reset',
}

export const createBoat = createAction(BOAT_ACTION_TYPES.CREATE, props<{ boat: Boat }>());
export const updateBoat = createAction(BOAT_ACTION_TYPES.UPDATE, props<{ boat_id: string; boat: Boat }>());
export const fetchBoats = createAction(BOAT_ACTION_TYPES.FETCH_MANY, props<{ notify?: boolean }>());
export const fetchBoat = createAction(BOAT_ACTION_TYPES.FETCH_ONE, props<{ boat_id: string }>());
export const putBoats = createAction(BOAT_ACTION_TYPES.PUT_MANY, props<{ boats: Boat[] }>());
export const putBoat = createAction(BOAT_ACTION_TYPES.PUT_ONE, props<{ boat_id: string; boat: Boat }>());
export const resetBoats = createAction(BOAT_ACTION_TYPES.RESET);
