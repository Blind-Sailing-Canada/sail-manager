import {
  createAction,
  props,
} from '@ngrx/store';
import { Boat } from '../../../../../api/src/types/boat/boat';

export enum BOAT_ACTION_TYPES {
  CREATE = '[Boat] Create',
  DELETE = '[Boat] Delete',
  FETCH_MANY = '[Boat] Fetch Many',
  FETCH_ONE = '[Boat] Fetch One',
  PUT_MANY = '[Boat] Put Many',
  PUT_ONE = '[Boat] Put One',
  RESET = 'Reset',
  UPDATE = '[Boat] Update',
}

export const createBoat = createAction(BOAT_ACTION_TYPES.CREATE, props<{ boat: Boat }>());
export const deleteBoat = createAction(BOAT_ACTION_TYPES.DELETE, props<{ boat_id: string }>());
export const fetchBoat = createAction(BOAT_ACTION_TYPES.FETCH_ONE, props<{ boat_id: string }>());
export const fetchBoats = createAction(BOAT_ACTION_TYPES.FETCH_MANY, props<{ notify?: boolean }>());
export const putBoat = createAction(BOAT_ACTION_TYPES.PUT_ONE, props<{ boat_id: string; boat: Boat | null }>());
export const putBoats = createAction(BOAT_ACTION_TYPES.PUT_MANY, props<{ boats: Boat[] }>());
export const resetBoats = createAction(BOAT_ACTION_TYPES.RESET);
export const updateBoat = createAction(BOAT_ACTION_TYPES.UPDATE, props<{ boat_id: string; boat: Boat }>());
