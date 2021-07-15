import { SailFeedback } from '../../../../api/src/types/sail-feedback/sail-feedback';

export interface Feedbacks {
  [propName: string]: SailFeedback;
}

export interface FeedbackssFetching {
  [propName: string]: boolean;
}

export interface FeedbackState {
  fetching: FeedbackssFetching;
  feedbacks: Feedbacks;
}
