import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { SailFeedback } from '../../../../../api/src/types/sail-feedback/sail-feedback';
import { FeedbackState } from '../../models/feedback.state';
import {
  putFeedback,
  putFeedbacks,
  resetFeedback,
} from '../actions/feedback.actions';

const initialState: FeedbackState = {
  fetching: {},
  feedbacks: {},
};

const reducerHandler = createReducer(
  initialState,
  on(resetFeedback, () => initialState),
  on(putFeedbacks, (state, action) => {
    const existingFeedback = Object.assign({}, state.feedbacks);
    const newActions = action
      .feedbacks
      .reduce(
        (red, ra) => {
          red[ra.id] = ra as SailFeedback;
          return red;
        },
        existingFeedback,
      );
    return Object.assign({}, state, { feedbacks: newActions } as FeedbackState);
  }),
  on(putFeedback, (state, action) => {
    const existingFeedback = Object.assign({}, state.feedbacks);
    existingFeedback[action.feedback_id] = action.feedback as SailFeedback;
    return Object.assign({}, state, { feedbacks: existingFeedback } as FeedbackState);
  }),
);

export const feedbackReducer = (state: FeedbackState, action: Action) => reducerHandler(state, action);
