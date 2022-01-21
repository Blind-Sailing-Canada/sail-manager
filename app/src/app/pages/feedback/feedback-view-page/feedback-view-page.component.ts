import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { SailFeedback } from '../../../../../../api/src/types/sail-feedback/sail-feedback';
import { SailFeedbackRating } from '../../../../../../api/src/types/sail-feedback/sail-feedback-rating';
import { FeedbackState } from '../../../models/feedback.state';
import { fetchFeedback } from '../../../store/actions/feedback.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-feedback-view-page',
  templateUrl: './feedback-view-page.component.html',
  styleUrls: ['./feedback-view-page.component.css']
})
export class FeedbackViewPageComponent extends BasePageComponent implements OnInit {

  public feedbackRatings = SailFeedbackRating;

  constructor(
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(Store) store: Store<any>,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.FEEDBACKS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS);
  }

  public get title(): string {
    const sailName = this.feedback?.sail?.name || 'unknown sail';
    return `Feedback for sail "${sailName}"`;
  }

  public get feedback_id(): string {
    return this.route.snapshot.params.feedback_id;
  }

  public get feedback(): SailFeedback {
    const feedbackState: FeedbackState = this.store[STORE_SLICES.FEEDBACKS];
    const allFeedback = feedbackState.feedbacks;

    const feedback = allFeedback[this.feedback_id];

    if (feedback === undefined && !this.fetching[this.feedback_id]) {
      this.fetching[this.feedback_id] = true;
      this.dispatchAction(fetchFeedback({ feedback_id: this.feedback_id }));
    }

    if (feedback || feedback === null) {
      delete this.fetching[this.feedback_id];
    }

    return feedback;
  }

  public goToSail(): void {
    this.viewSail(this.feedback?.sail_id);
  }
}
