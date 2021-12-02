import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { ChallengeState } from '../../models/challenge-state.interface';
import {
  putChallenge,
  putChallenges,
  resetChallenges,
} from '../actions/challenge.actions';

const initialState: ChallengeState = {};

const reducerHandler = createReducer(
  initialState,
  on(resetChallenges, () => initialState),
  on(putChallenge, (state, action) => Object.assign({}, state, { [action.challengeId]: action.challenge } as ChallengeState)),
  on(putChallenges, (state, action) => {
    const mappedChallenges = action
      .challenges
      .reduce(
        (red, challenge) => {
          red[challenge.id] = challenge;
          return red;
        },
        {}
      );
    return Object.assign({}, state, mappedChallenges);
  }),
);

export const challengeReducer = (state: ChallengeState | undefined, action: Action) => reducerHandler(state, action);
