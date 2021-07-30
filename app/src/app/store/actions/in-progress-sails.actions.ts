import {
  createAction,
  props,
} from '@ngrx/store';
import { Sail } from '../../../../../api/src/types/sail/sail';

export enum IN_PROGRESS_SAILS_ACTION_TYPES {
  FETCH_ALL = '[In Progress Sails] Fetch For All',
  FETCH_USER = '[In Progress Sails] Fetch For User',
  PUT_ALL = '[In Progress Sails] Put For All',
  PUT_USER = '[In Progress Sails] Put For User',
  RESET = 'Reset',
}

export const fetchInProgressSailsForAll = createAction(
  IN_PROGRESS_SAILS_ACTION_TYPES.FETCH_ALL, props<{ query?: string, notify?: boolean }>());
export const fetchInProgressSailsForUser = createAction(
  IN_PROGRESS_SAILS_ACTION_TYPES.FETCH_USER,
  props<{ id: string, query?: string, notify?: boolean }>());
export const putInProgressSailsForAll = createAction(IN_PROGRESS_SAILS_ACTION_TYPES.PUT_ALL, props<{ sails: Sail[] }>());
export const putInProgressSailsForUser = createAction(
  IN_PROGRESS_SAILS_ACTION_TYPES.PUT_USER, props<{ profile_id: string, sails: Sail[] }>());
export const resetInProgressSails = createAction(IN_PROGRESS_SAILS_ACTION_TYPES.RESET);
