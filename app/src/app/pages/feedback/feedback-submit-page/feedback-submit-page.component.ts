import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { SailFeedback } from '../../../../../../api/src/types/sail-feedback/sail-feedback';
import { SailFeedbackRating } from '../../../../../../api/src/types/sail-feedback/sail-feedback-rating';
import { Sail } from '../../../../../../api/src/types/sail/sail';
import { submitFeedback } from '../../../store/actions/feedback.actions';
import { completeRequiredAction } from '../../../store/actions/required-actions.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-feedback-submit-page',
  templateUrl: './feedback-submit-page.component.html',
  styleUrls: ['./feedback-submit-page.component.scss']
})
export class FeedbackSubmitPageComponent extends BasePageComponent implements OnInit {

  public submitFeedbackForm: UntypedFormGroup;
  public feedbackRatingKeys = Object.keys(SailFeedbackRating).filter(key => isNaN(Number(key)));
  public feedbackRatingValues = Object.values(SailFeedbackRating).filter(key => !isNaN(Number(key)));
  public FEEDBACK_RATING = SailFeedbackRating;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(UntypedFormBuilder) private fb: UntypedFormBuilder,
  ) {
    super(store, route, router);
    this.buildForm();
  }

  ngOnInit() {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS);
  }

  public goToSail(): void {
    this.viewSail(this.sail_id);
  }

  public setRating(rating: number): void {
    this.submitFeedbackForm.controls.rating.patchValue(rating);
    this.submitFeedbackForm.controls.rating.markAsDirty();
  }

  public get title(): string {
    return `Feedback Form For Sail: ${(this.sail || {}).name}`;
  }

  public get sail_id(): string {
    return this.route.snapshot.params.sail_id;
  }

  public get sail(): Sail {
    return this.getSail(this.sail_id);
  }

  public get shouldEnableSubmitButton(): boolean {
    return this.submitFeedbackForm && this.submitFeedbackForm.valid && this.submitFeedbackForm.dirty;
  }

  public get currentRating(): number {
    return this.submitFeedbackForm.controls.rating.value;
  }

  public submitForm(): void {
    const feedback: SailFeedback = this.submitFeedbackForm.getRawValue();

    feedback.sail_id = this.sail_id;

    const completeRequiredActionId = this.route.snapshot.queryParams.completeRequiredAction;

    if (completeRequiredActionId) {
      this.dispatchAction(
        submitFeedback(
          { feedback, notify: true, completeRequiredAction: completeRequiredAction({ action_id: completeRequiredActionId }) }));
    } else {
      this.dispatchAction(
        submitFeedback({ feedback, notify: true, completeRequiredAction: null }));
    }
  }

  private buildForm(): void {
    this.submitFeedbackForm = this.fb.group({
      rating: this.fb.control(SailFeedbackRating.Average),
      feedback: this.fb.control(undefined),
    });
  }

}
