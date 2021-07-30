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

  public get feedbackId(): string {
    return this.route.snapshot.params.feedbackId;
  }

  public get feedback(): SailFeedback {
    const feedbackState: FeedbackState = this.store[STORE_SLICES.FEEDBACKS];
    const allFeedback = feedbackState.feedbacks;

    const feedback = allFeedback[this.feedbackId];

    if (feedback === undefined && !this._fetching[this.feedbackId]) {
      this._fetching[this.feedbackId] = true;
      this.dispatchAction(fetchFeedback({ feedbackId: this.feedbackId }));
    }

    if (feedback || feedback === null) {
      delete this._fetching[this.feedbackId];
    }

    return feedback;
  }

  public goToSail(): void {
    this.viewSail(this.feedback?.sail_id);
  }
}
