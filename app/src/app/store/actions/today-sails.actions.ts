import {
  createAction,
  props,
} from '@ngrx/store';
import { Sail } from '../../../../../api/src/types/sail/sail';

export enum TODAY_SAILS_ACTION_TYPES {
  FETCH_ALL = '[Today Sails] Fetch For All',
  FETCH_USER = '[Today Sails] Fetch For User',
  PUT_ALL = '[Today Sails] Put For All',
  PUT_USER = '[Today Sails] Put For User',
  RESET = 'Reset',
}

export const fetchTodaySailsForAll = createAction(TODAY_SAILS_ACTION_TYPES.FETCH_ALL, props<{ query?: string; notify?: boolean }>());
export const fetchTodaySailsForUser = createAction(
  TODAY_SAILS_ACTION_TYPES.FETCH_USER,
  props<{ profile_id: string; query?: string; notify?: boolean }>());
export const putTodaySailsForAll = createAction(TODAY_SAILS_ACTION_TYPES.PUT_ALL, props<{ sails: Sail[] }>());
export const putTodaySailsForUser = createAction(TODAY_SAILS_ACTION_TYPES.PUT_USER, props<{ profile_id: string; sails: Sail[] }>());
export const resetTodaySails = createAction(TODAY_SAILS_ACTION_TYPES.RESET);
