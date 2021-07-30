import {
  createAction,
  props,
} from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { Comment } from '../../../../../api/src/types/comment/comment';
import { Sail } from '../../../../../api/src/types/sail/sail';

export enum SAIL_ACTION_TYPES {
  CANCEL = '[Sail] Cancel',
  COMPLETE = '[Sail] Complete',
  CREATE = '[Sail] Create',
  CREATE_FROM_SAIL_REQUEST = '[Sail] Create from sail request',
  FETCH_MANY = '[Sail] Fetch Many',
  FETCH_ONE = '[Sail] Fetch One',
  JOIN_CREW = '[Sail] Join As Crew',
  JOIN_PASSENGER = '[Sail] Join As Passenger',
  JOIN_SKIPPER = '[Sail] Join As Skipper',
  LEAVE_SAIL = '[Sail] Leave',
  POST_COMMENT = '[Sail] Post Comment',
  DELETE_COMMENT = '[Sail] Delete Comment',
  PUT_MANY = '[Sail] Put Many',
  PUT_ONE = '[Sail] Put One',
  PUT_SEARCH_RESULTS = '[Sail] Put Search Results',
  RESET = 'Reset',
  SEARCH = '[Sail] Search',
  START = '[Sail] Start',
  UPDATE_ONE = '[Sail] Update One',
  SEND_SAIL_NOTIFICATION = '[Sail] Send Sail Notification',
}

export const sendSailNotification = createAction(
  SAIL_ACTION_TYPES.SEND_SAIL_NOTIFICATION,
  props<{ sail_id: string, notificationType: string, notificationMessage: string, notify?: boolean }>(),
);
export const cancelSail = createAction(SAIL_ACTION_TYPES.CANCEL, props<{ id: string, sail: Sail, notify?: boolean }>());
export const postSailComment = createAction(
  SAIL_ACTION_TYPES.POST_COMMENT, props<{ sail_id: string, comment: Comment, notify?: boolean }>());
export const deleteSailComment = createAction(
  SAIL_ACTION_TYPES.DELETE_COMMENT, props<{ sail_id: string, commentId: string, notify?: boolean }>());
export const completeSail = createAction(SAIL_ACTION_TYPES.COMPLETE, props<{ sail: Sail, notify?: boolean }>());
export const createSail = createAction(SAIL_ACTION_TYPES.CREATE, props<{ sail: Sail }>());
export const createSailFromSailRequest = createAction(
  SAIL_ACTION_TYPES.CREATE_FROM_SAIL_REQUEST, props<{ sail: Sail, sailRequestId: string }>());
export const startSail = createAction(SAIL_ACTION_TYPES.START, props<{ sail: Sail, notify?: boolean }>());
export const fetchSail = createAction(SAIL_ACTION_TYPES.FETCH_ONE, props<{ id: string, notify?: boolean }>());
export const fetchSails = createAction(SAIL_ACTION_TYPES.FETCH_MANY, props<{ notify?: boolean, query?: string }>());
export const joinSailAsCrew = createAction(SAIL_ACTION_TYPES.JOIN_CREW, props<{ sail_id: string, notify?: boolean }>());
export const joinSailAsPassenger = createAction(
  SAIL_ACTION_TYPES.JOIN_PASSENGER, props<{ sail_id: string, notify?: boolean }>());
export const joinSailAsSkipper = createAction(
  SAIL_ACTION_TYPES.JOIN_SKIPPER, props<{ sail_id: string, notify?: boolean }>());
export const leaveSail = createAction(SAIL_ACTION_TYPES.LEAVE_SAIL, props<{ sail_id: string, notify?: boolean }>());
export const putSail = createAction(SAIL_ACTION_TYPES.PUT_ONE, props<{ id: string, sail: Sail }>());
export const putSails = createAction(SAIL_ACTION_TYPES.PUT_MANY, props<{ sails: Sail[] }>());
export const putSailSearchResults = createAction(SAIL_ACTION_TYPES.PUT_SEARCH_RESULTS, props<{ sails: Sail[] }>());
export const searchSails = createAction(SAIL_ACTION_TYPES.SEARCH, props<{ notify?: boolean, query?: any }>());
export const resetSails = createAction(SAIL_ACTION_TYPES.RESET);
export const updateSail = createAction(
  SAIL_ACTION_TYPES.UPDATE_ONE,
  props<{ id: string, sail: Sail, updateActions?: TypedAction<any>[] }>());
