import {
  createAction,
  props,
} from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';

export enum APP_ACTION_TYPES {
  FINISH_CHANGING_FONT = '[App] Finish changing font',
  FINISH_LOADING = '[App] Finish Loading',
  GO_TO = '[App] Go to',
  RESET = 'Reset',
  SET_FONT_SIZE = '[App] Set font size',
  START_CHANGING_FONT = '[App] Start changing font',
  START_LOADING = '[App] Start Loading',
}

export const finishChangingAppFont = createAction(APP_ACTION_TYPES.FINISH_CHANGING_FONT);
export const finishLoading = createAction(APP_ACTION_TYPES.FINISH_LOADING);
export const goTo = createAction(APP_ACTION_TYPES.GO_TO, props<{route: string; data?: any; actionToPerformAfter?: TypedAction<any>}>());
export const resetApp = createAction(APP_ACTION_TYPES.RESET);
export const setAppFontSize = createAction(APP_ACTION_TYPES.SET_FONT_SIZE, props<{fontSize: string}>());
export const startChangingAppFont = createAction(APP_ACTION_TYPES.START_CHANGING_FONT);
export const startLoading = createAction(APP_ACTION_TYPES.START_LOADING);
