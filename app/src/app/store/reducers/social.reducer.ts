import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { SocialState } from '../../models/social-state';
import { putSocial, putSocials, resetSocials } from '../actions/social.actions';

const initialState = {} as SocialState;

const reducerHandler = createReducer(
  initialState,
  on(resetSocials, () => initialState),
  on(putSocial, (state, action) => Object.assign({}, state, { [action.id]: action.social } as SocialState)),
  on(putSocials, (state, action) => {
    const map = action
      .socials
      .reduce(
        (reducer, social) => {
          reducer[social.id] = social;
          return reducer;
        },
        {},
      );
    return Object.assign({}, state, { ...map } as SocialState);
  }),
);

export const socialReducer = (state: SocialState | undefined, action: Action) => reducerHandler(state, action);
