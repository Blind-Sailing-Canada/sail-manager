import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { TodaySailsState } from '../../models/today-sails-state.interface';
import { putTodaySailsForAll, putTodaySailsForUser, resetTodaySails } from '../actions/today-sails.actions';

const initialState = {} as TodaySailsState;

const reducerHandler = createReducer(
  initialState,
  on(resetTodaySails, () => initialState),
  on(putTodaySailsForAll, (state, action) => Object.assign({}, state, { all: action.sails })),
  on(putTodaySailsForUser, (state, action) => Object.assign({}, state, { [action.profile_id]: action.sails }))
);

export const todaySailsReducer = (state: TodaySailsState | undefined, action: Action)  => reducerHandler(state, action);
