import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { InProgressSailsState } from '../../models/in-progress-sails-state';
import {
  putInProgressSailsForAll,
  putInProgressSailsForUser,
  resetInProgressSails,
} from '../actions/in-progress-sails.actions';

const initialState: InProgressSailsState = {} as InProgressSailsState;

const reducerHandler = createReducer(
  initialState,
  on(resetInProgressSails, () => initialState),
  on(putInProgressSailsForAll, (state, action) => {
    return Object.assign({}, state, { all: action.sails });
  }),
  on(putInProgressSailsForUser, (state, action) => {
    return Object.assign({}, state, { [action.profileId]: action.sails });
  })
);

export function inProgressSailsReducer(state: InProgressSailsState | undefined, action: Action) {
  return reducerHandler(state, action);
}
