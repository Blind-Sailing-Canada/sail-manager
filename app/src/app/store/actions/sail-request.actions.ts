import {
  createAction,
  props,
} from '@ngrx/store';
import { SailRequest } from '../../../../../api/src/types/sail-request/sail-request';

export enum SAIL_REQUEST_ACTION_TYPES {
  CANCEL = '[Sail Request] Cancel',
  CREATE = '[Sail Request] Create',
  EXPIRE = '[Sail Request] Expire',
  FETCH_MANY = '[Sail Request] Fetch Many',
  FETCH_ONE = '[Sail Request] Fetch One',
  PUT_MANY = '[Sail Request] Put Many',
  PUT_ONE = '[Sail Request] Put One',
  RESET = 'Reset',
  SCHEDULE = '[Sail Request] Schedule',
  UPDATE = '[Sail Request] Update',
}

export const cancelSailRequest = createAction(SAIL_REQUEST_ACTION_TYPES.CANCEL, props<{ id: string }>());
export const createSailRequest = createAction(SAIL_REQUEST_ACTION_TYPES.CREATE, props<{ sailRequest: SailRequest }>());
export const expireSailRequest = createAction(SAIL_REQUEST_ACTION_TYPES.EXPIRE, props<{ id: string }>());
export const fetchSailRequest = createAction(SAIL_REQUEST_ACTION_TYPES.FETCH_ONE, props<{ id: string }>());
export const fetchSailRequests = createAction(SAIL_REQUEST_ACTION_TYPES.FETCH_MANY, props<{ query?: string, notify?: boolean }>());
export const putSailRequest = createAction(SAIL_REQUEST_ACTION_TYPES.PUT_ONE, props<{ id: string, sailRequest: SailRequest }>());
export const putSailRequests = createAction(SAIL_REQUEST_ACTION_TYPES.PUT_MANY, props<{ sailRequests: SailRequest[] }>());
export const resetSailRequest = createAction(SAIL_REQUEST_ACTION_TYPES.RESET);
export const scheduleSailRequest = createAction(SAIL_REQUEST_ACTION_TYPES.SCHEDULE, props<{ id: string }>());
export const updateSailRequest = createAction(SAIL_REQUEST_ACTION_TYPES.UPDATE, props<{ id: string, sailRequest: SailRequest}>());
