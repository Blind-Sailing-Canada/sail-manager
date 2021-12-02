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
  on(putInProgressSailsForAll, (state, action) => Object.assign({}, state, { all: action.sails })),
  on(putInProgressSailsForUser, (state, action) => Object.assign({}, state, { [action.profile_id]: action.sails }))
);

export const inProgressSailsReducer = (state: InProgressSailsState | undefined, action: Action) => reducerHandler(state, action);
