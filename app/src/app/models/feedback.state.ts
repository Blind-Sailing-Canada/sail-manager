import { SailFeedback } from '../../../../api/src/types/sail-feedback/sail-feedback';

export interface Feedbacks {
  [propName: string]: SailFeedback;
}

export interface FeedbacksFetching {
  [propName: string]: boolean;
}

export interface FeedbackState {
  fetching: FeedbacksFetching;
  feedbacks: Feedbacks;
}
