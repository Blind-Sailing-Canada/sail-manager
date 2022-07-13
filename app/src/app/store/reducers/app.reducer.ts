import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { AppState } from '../../models/app-state.interface';
import {
  finishChangingAppFont,
  finishLoading,
  resetApp,
  setAppFontSize,
  setAppTheme,
  startChangingAppFont,
  startLoading,
} from '../actions/app.actions';

const defaultTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const initialState: AppState = {
  loading: 0,
  fontSize: 'default',
  changingFont: false,
  theme: localStorage.getItem('theme') || defaultTheme,
};

const reducerHandler = createReducer(
  initialState,
  on(finishChangingAppFont, (state) => Object.assign({}, state, { changingFont: false } as AppState)),
  on(finishLoading, (state) => Object.assign({}, state, { loading: Math.max(0, state.loading - 1) } as AppState)),
  on(resetApp, () => initialState),
  on(setAppFontSize, (state, action) => Object.assign({}, state, { fontSize: action.fontSize } as AppState)),
  on(setAppTheme, (state, action) => Object.assign({}, state, { theme: action.theme } as AppState)),
  on(startChangingAppFont, (state) => Object.assign({}, state, { changingFont: true } as AppState)),
  on(startLoading, (state) => Object.assign({}, state, { loading: state.loading + 1 } as AppState)),
);

export const appReducer = (state: AppState | undefined, action: Action) => reducerHandler(state, action);
