import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { PastSailsState } from '../../models/past-sails-state.interface';
import {
  putPastSailsForAll,
  putPastSailsForUser,
  resetPastSails,
} from '../actions/past-sails.actions';

const initialState = {} as PastSailsState;

const reducerHandler = createReducer(
  initialState,
  on(resetPastSails, () => initialState),
  on(putPastSailsForAll, (state, action) => Object.assign({}, state, { all: action.sails })),
  on(putPastSailsForUser, (state, action) => Object.assign({}, state, { [action.profile_id]: action.sails }))
);

export const pastSailsReducer = (state: PastSailsState | undefined, action: Action) => reducerHandler(state, action);
