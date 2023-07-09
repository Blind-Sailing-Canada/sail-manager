import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { ISailState } from '../../models/sail-state.interface';
import {
  putSail,
  resetSails,
} from '../actions/sail.actions';

const initialState = {} as ISailState;

const reducerHandler = createReducer(
  initialState,
  on(resetSails, () => initialState),
  on(putSail, (state, action) => {
    const newAll = Object.assign({}, state.all, { [action.id]: action.sail });

    return Object.assign({}, state, { all: newAll } as ISailState);
  }),
);

export const sailReducer = (state: ISailState | undefined, action: Action) => reducerHandler(state, action);
