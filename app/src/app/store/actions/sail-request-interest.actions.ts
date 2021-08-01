import {
  createAction,
  props,
} from '@ngrx/store';

export enum SAIL_REQUEST_INTEREST_ACTION_TYPES {
  INTERESTED = '[Sail Request Intereset] Interested',
  UNINTERESTED = '[Sail Request Intereset] Uninterested',
  RESET = 'Reset',
}

export const interestedSailRequest = createAction(SAIL_REQUEST_INTEREST_ACTION_TYPES.INTERESTED, props<{ sail_request_id: string }>());
export const uninterestedSailRequest = createAction(SAIL_REQUEST_INTEREST_ACTION_TYPES.UNINTERESTED, props<{ sail_request_id: string }>());
export const resetSailRequestInterest = createAction(SAIL_REQUEST_INTEREST_ACTION_TYPES.RESET);
