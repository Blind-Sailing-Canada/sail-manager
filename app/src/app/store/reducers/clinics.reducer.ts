import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { ClinicsState } from '../../models/clinics.state';
import {
  putClinic,
  putClinics,
  resetClinics,
} from '../actions/clinic.actions';

const initialState: ClinicsState = {
};

const reducerHandler = createReducer(
  initialState,
  on(resetClinics, () => initialState),
  on(putClinic, (state, action) => Object.assign({}, state, { [action.clinicId]: action.clinic })),
  on(putClinics, (state, action) => {
    const newClinics = action.clinics
      .reduce(
        (red, clinic) => {
          red[clinic.id] = clinic;
          return red;
        },
        {},
      );
    return Object.assign({}, state, newClinics);
  }),
);

export const clinicsReducer = (state: ClinicsState, action: Action) => reducerHandler(state, action);
