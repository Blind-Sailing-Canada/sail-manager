import {
  createReducer,
  on,
  Action,
} from '@ngrx/store';
import {
  putBoatMaintenance,
  resetBoatMaintenances,
  putBoatMaintenances,
} from '../actions/boat-maintenance.actions';
import { IBoatMaintenanceState } from '../../models/boat-maintenance-state.interface';

const initialState = {} as IBoatMaintenanceState;

const reducerHandler = createReducer(
  initialState,
  on(resetBoatMaintenances, () => initialState),
  on(putBoatMaintenance, (state, action) => Object.assign({}, state, { [action.id]: action.maintenance })),
  on(putBoatMaintenances, (state, action) => {
    const map = action
      .maintenances
      .reduce(
        (reducer, maintenance) => {
          reducer[maintenance.id] = maintenance;
          return reducer;
        },
        {},
      );

    return Object.assign({}, state, map);
  })
);

export const boatMaintenanceReducer = (state: IBoatMaintenanceState | undefined, action: Action) => reducerHandler(state, action);
