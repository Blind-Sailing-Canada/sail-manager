import {
  createAction,
  props,
} from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';

export enum Actions {
  FINISH_CHANGING_FONT = '[App] Finish changing font',
  FINISH_LOADING = '[App] Finish Loading',
  GO_TO = '[App] Go to',
  RESET = 'Reset',
  SET_FONT_SIZE = '[App] Set font size',
  SET_THEME = '[App] Set theme',
  START_CHANGING_FONT = '[App] Start changing font',
  START_LOADING = '[App] Start Loading',
}

export const finishChangingAppFont = createAction(Actions.FINISH_CHANGING_FONT);
export const finishLoading = createAction(Actions.FINISH_LOADING);
export const goTo = createAction(Actions.GO_TO, props<{ route: string; data?: any; actionToPerformAfter?: TypedAction<any> }>());
export const resetApp = createAction(Actions.RESET);
export const setAppFontSize = createAction(Actions.SET_FONT_SIZE, props<{ fontSize: string }>());
export const setAppTheme = createAction(Actions.SET_THEME, props<{ theme: string }>());
export const startChangingAppFont = createAction(Actions.START_CHANGING_FONT);
export const startLoading = createAction(Actions.START_LOADING);
