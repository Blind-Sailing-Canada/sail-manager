import {
  createReducer,
  on,
  Action,
} from '@ngrx/store';
import {
  putBoat,
  resetBoats,
  putBoats,
} from '../actions/boat.actions';
import { IBoatState } from '../../models/boat-state.interface';

const initialState = {} as IBoatState;

const reducerHandler = createReducer(
  initialState,
  on(resetBoats, () => initialState),
  on(putBoat, (state, action) => Object.assign({}, state, { [action.id]: action.boat })),
  on(putBoats, (state, action) => {
    const map = action
      .boats
      .reduce(
        (reducer, boat) => {
          reducer[boat.id] = boat;
          return reducer;
        },
        {},
      );

    return Object.assign({}, state, map);
  })
);

export const boatReducer = (state: IBoatState | undefined, action: Action) => reducerHandler(state, action);
