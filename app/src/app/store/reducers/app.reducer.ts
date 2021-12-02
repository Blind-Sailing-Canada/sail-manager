import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { IAppState } from '../../models/app-state.interface';
import {
  finishChangingAppFont,
  finishLoading,
  resetApp,
  setAppFontSize,
  startChangingAppFont,
  startLoading,
} from '../actions/app.actions';

const initialState: IAppState = {
  loading: 0,
  fontSize: 'default',
  changingFont: false,
};

const reducerHandler = createReducer(
  initialState,
  on(resetApp, () => initialState),
  on(startChangingAppFont, (state) => Object.assign({}, state, { changingFont: true } as IAppState)),
  on(finishChangingAppFont, (state) => Object.assign({}, state, { changingFont: false } as IAppState)),
  on(setAppFontSize, (state, action) => Object.assign({}, state, { fontSize: action.fontSize } as IAppState)),
  on(startLoading, (state) => Object.assign({}, state, { loading: state.loading + 1 } as IAppState)),
  on(finishLoading, (state) => Object.assign({}, state, { loading: Math.max(0, state.loading - 1) } as IAppState)),
);

export const appReducer = (state: IAppState | undefined, action: Action) => reducerHandler(state, action);
