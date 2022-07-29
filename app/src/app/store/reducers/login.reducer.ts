import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { LoginState } from '../../models/login-state';
import { decodeJwt } from '../../utils/jwt';
import {
  loggedIn,
  loggedOut,
  putToken,
  resetLogin,
} from '../actions/login.actions';

const initialState: LoginState = {
  token: null,
  tokenData: null,
  user: null,
  when: new Date(),
};

const reducerHandler = createReducer(
  initialState,
  on(resetLogin, () => {
    localStorage.clear();
    sessionStorage.clear();
    return initialState;
  }),
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

export const loginReducer = (state: LoginState | undefined, action: Action) => reducerHandler(state, action);
