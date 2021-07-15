import {
  createAction,
  props,
} from '@ngrx/store';
import { Sail } from '../../../../../api/src/types/sail/sail';

export enum FUTURE_SAILS_ACTION_TYPES {
  FETCH_ALL = '[Future Sails] Fetch For All',
  FETCH_USER = '[Future Sails] Fetch For User',
  PUT_ALL = '[Future Sails] Put For All',
  PUT_USER = '[Future Sails] Put For User',
  RESET = 'Reset',
}

export const fetchFutureSailsForAll = createAction(FUTURE_SAILS_ACTION_TYPES.FETCH_ALL, props<{ query?: string, notify?: boolean }>());
export const fetchFutureSailsForUser = createAction(
  FUTURE_SAILS_ACTION_TYPES.FETCH_USER,
  props<{ profileId: string, query?: string, notify?: boolean }>());
export const putFutureSailsForAll = createAction(FUTURE_SAILS_ACTION_TYPES.PUT_ALL, props<{ sails: Sail[] }>());
export const putFutureSailsForUser = createAction(FUTURE_SAILS_ACTION_TYPES.PUT_USER, props<{ profileId: string, sails: Sail[] }>());
export const resetFutureSails = createAction(FUTURE_SAILS_ACTION_TYPES.RESET);
