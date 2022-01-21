import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { IProfileState } from '../../models/profile-state.interface';
import {
  putProfile,
  putProfiles,
  putTotalProfileCount,
  resetProfiles,
} from '../actions/profile.actions';

const initialState = {} as IProfileState;

const reducerHandler = createReducer(
  initialState,
  on(resetProfiles, () => initialState),
  on(putTotalProfileCount, (state, action) => Object.assign({}, state, { totalCount: action.count })),
  on(putProfile, (state, action) => {
    const updatedProfiles = Object.assign({}, state.profiles, { [action.profile_id]: action.profile });
    return Object.assign({}, state, { profiles: updatedProfiles });
  }),
  on(putProfiles, (state, action) => {
    const map = action
      .profiles
      .reduce(
        (reducer, profile) => {
          reducer[profile.id] = profile;
          return reducer;
        },
        {},
      );

    const updatedProfiles = Object.assign({}, state.profiles, map);
    return Object.assign({}, state, { profiles: updatedProfiles });
  }),
);

export const profileReducer = (state: IProfileState | undefined, action: Action) => reducerHandler(state, action);
