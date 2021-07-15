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
  on(putTodaySailsForAll, (state, action) => {
    return Object.assign({}, state, { all: action.sails });
  }),
  on(putTodaySailsForUser, (state, action) => {
    return Object.assign({}, state, { [action.profileId]: action.sails });
  })
);

export function todaySailsReducer(state: TodaySailsState | undefined, action: Action) {
  return reducerHandler(state, action);
}
