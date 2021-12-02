import {
  createAction,
  props,
} from '@ngrx/store';
import { UserAccess } from '../../../../../api/src/types/user-access/user-access';

export enum USER_ACCESS_ACTION_TYPES {
  FETCH_USER_ACCESS = '[User Access] Fetch user access',
  PUT_USER_ACCESS = '[User Access] Put user access',
  RESET = 'Reset',
  UPDATE_USER_ACCESS = '[User Access] Update user access',
}

export const fetchUserAccess = createAction(USER_ACCESS_ACTION_TYPES.FETCH_USER_ACCESS, props<{profile_id: string}>());
export const putUserAccess = createAction(USER_ACCESS_ACTION_TYPES.PUT_USER_ACCESS, props<{ profile_id: string; access: UserAccess }>());
export const resetUserAccess = createAction(USER_ACCESS_ACTION_TYPES.RESET);
