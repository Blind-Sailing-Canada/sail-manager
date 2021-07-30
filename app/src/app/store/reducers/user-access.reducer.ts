import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { UserAccessState } from '../../models/user-access.state';
import {
  putUserAccess,
  resetUserAccess,
} from '../actions/user-access.actions';

const initialState = {} as UserAccessState;

const reducerHandler = createReducer(
  initialState,
  on(resetUserAccess, () => initialState),
  on(putUserAccess, (state, action) => {
    return Object.assign({}, state, { [action.profile_id]: action.access });
  }),
);

export function userAccessReducer(state: UserAccessState | undefined, action: Action) {
  return reducerHandler(state, action);
}
