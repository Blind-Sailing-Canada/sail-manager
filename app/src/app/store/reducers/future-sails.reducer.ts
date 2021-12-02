import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { FutureSailsState } from '../../models/future-sails-state.interface';
import {
  putFutureSailsForAll,
  putFutureSailsForUser,
  resetFutureSails,
} from '../actions/future-sails.actions';

const initialState = {} as FutureSailsState;

const reducerHandler = createReducer(
  initialState,
  on(resetFutureSails, () => initialState),
  on(putFutureSailsForAll, (state, action) => Object.assign({}, state, { all: action.sails })),
  on(putFutureSailsForUser, (state, action) => Object.assign({}, state, { [action.profile_id]: action.sails }))
);

export const futureSailsReducer = (state: FutureSailsState | undefined, action: Action) => reducerHandler(state, action);
