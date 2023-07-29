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
import { firstValueFrom } from 'rxjs';
import { SailFeedbackRating } from '../../../../../../api/src/types/sail-feedback//sail-feedback-rating';
import { SailFeedback } from '../../../../../../api/src/types/sail-feedback/sail-feedback';
import { Sail } from '../../../../../../api/src/types/sail/sail';
import { viewFeedbackRoute } from '../../../routes/routes';
import { FeedbackService } from '../../../services/feedback.service';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-feedback-list-page',
  templateUrl: './feedback-list-page.component.html',
  styleUrls: ['./feedback-list-page.component.scss']
})
export class FeedbackListPageComponent extends BasePageComponent implements OnInit {

  public feedbackRatings = SailFeedbackRating;
  public feedbacks: SailFeedback[] = [];

  constructor(
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(Store) store: Store<any>,
    @Inject(FeedbackService) private feedbackService: FeedbackService,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS);
    this.fetchSailFeedback();
  }

  public get sail_id(): string {
    return this.route.snapshot.params.sail_id;
  }

  public viewFeedback(id: string): void {
    this.goTo([viewFeedbackRoute(id)]);
  }

  public goToSail(): void {
    this.viewSail(this.sail_id);
  }

  public get sail(): Sail {
    return this.getSail(this.sail_id);
  }

  public get title(): string {
    return `All feedback for sail "${(this.sail || {}).name || ''}"`;
  }

  public feedbackAriaLabel(feedback: SailFeedback, index: number) {
    const feedbackText = feedback.feedback || 'not provided';
    const rating = this.feedbackRatings[feedback.rating];

    return `feedback ${index + 1} of ${this.feedbacks.length}. feedback: ${feedbackText}. rating: ${rating}`;
  }

  public get averageRating(): string {
    const average = Math.floor(this.feedbacks.reduce((red, feedback) => red + (+feedback.rating), 0) / this.feedbacks.length);

    return this.feedbackRatings[average];
  }

  private async fetchSailFeedback(): Promise<void> {

    const query = { sail_id: this.sail_id };

    this.startLoading();

    const fetcher =  this.feedbackService.fetchAllPaginated(query, 1, 100, 'created_at,DESC');
    const paginatedData = await firstValueFrom(fetcher).finally(() => this.finishLoading());
    this.feedbacks = paginatedData.data;


    this.dispatchMessage(`Displaying ${this.feedbacks.length} sail feedbacks.`);
  }
}
