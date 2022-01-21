import {
  createAction,
  props,
} from '@ngrx/store';
import { RequiredAction } from '../../../../../api/src/types/required-action/required-action';

export enum REQUIRED_ACTIONS_ACTION_TYPES {
  COMPLETE_REQUIRED_ACTION = '[Required Actions] Complete required action',
  DISMISS_REQUIRED_ACTION = '[Required Actions] Dismiss required action',
  FETCH_NEW_ACTIONS_FOR_USER = '[Required Actions] Fetch new actions for user',
  PUT_REQUIRED_ACTIONS = '[Required Actions] Put required actions',
  PUT_REQUIRED_ACTION = '[Required Actions] Put required action',
  RESET = 'Reset',
}

export const fetchNewRequiredActionsForUser = createAction(
  REQUIRED_ACTIONS_ACTION_TYPES.FETCH_NEW_ACTIONS_FOR_USER, props<{user_id: string}>());
export const completeRequiredAction = createAction(
  REQUIRED_ACTIONS_ACTION_TYPES.COMPLETE_REQUIRED_ACTION, props<{action_id: string; notify?: boolean}>());
export const dismissRequiredAction = createAction(
  REQUIRED_ACTIONS_ACTION_TYPES.DISMISS_REQUIRED_ACTION, props<{action_id: string; notify?: boolean}>());
export const putRequiredAction = createAction(
  REQUIRED_ACTIONS_ACTION_TYPES.PUT_REQUIRED_ACTION, props<{action_id: string; action: Partial<RequiredAction>}>());
export const putRequiredActions = createAction(
  REQUIRED_ACTIONS_ACTION_TYPES.PUT_REQUIRED_ACTIONS, props<{actions: Partial<RequiredAction>[]}>());
export const resetRequiredActions = createAction(REQUIRED_ACTIONS_ACTION_TYPES.RESET);
