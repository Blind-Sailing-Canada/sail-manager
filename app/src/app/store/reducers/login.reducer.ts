import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { ILoginState } from '../../models/login-state.interface';
import { decodeJwt } from '../../utils/jwt';
import {
  loggedIn,
  loggedOut,
  putToken,
  resetLogin,
} from '../actions/login.actions';

const initialState: ILoginState = {
  token: null,
  tokenData: null,
  user: null,
  when: new Date(),
};

const reducerHandler = createReducer(
  initialState,
  on(resetLogin, () => initialState),
  on(putToken, (state, action) => {
    sessionStorage.setItem('token', action.token);
    const tokenData = decodeJwt(action.token);
    return Object.assign({}, state, { tokenData, token: action.token, when: new Date() });
  }),
  on(loggedOut, () => {
    localStorage.clear();
    sessionStorage.clear();
    return initialState;
  }),
  on(loggedIn, (state, action) => Object.assign({}, state, { user: action.user, when: new Date() })),
);

export const loginReducer = (state: ILoginState | undefined, action: Action) => reducerHandler(state, action);
