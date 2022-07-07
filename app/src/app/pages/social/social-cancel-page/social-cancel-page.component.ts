import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Social } from '../../../../../../api/src/types/social/social';

import { cancelSocial } from '../../../store/actions/social.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-social-edit-page',
  templateUrl: './social-cancel-page.component.html',
  styleUrls: ['./social-cancel-page.component.css']
})
export class SocialCancelPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
  public socialCancelForm: UntypedFormGroup;
  public social_id: string;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(UntypedFormBuilder) private fb: UntypedFormBuilder,
  ) {
    super(store, route);
  }

  ngOnInit() {
    this.social_id = this.route.snapshot.params.id;

    this.buildForm();
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SOCIALS, () => {
      const social = this.socials[this.social_id];

      if (!social && social !== null) {
        this.fetchSocial(this.social_id);
        return;
      }

      this.updateForm(social);

    });
  }

  public get shouldEnableSubmitButton(): boolean {
    if (!this.socialCancelForm) {
      return false;
    }

    return this.socialCancelForm.dirty && this.socialCancelForm.valid;
  }

  public submitCancelForm(): void {
    const cancelledSocial: Social = this.socialCancelForm.value;
    cancelledSocial.cancelled_by_id = this.user.profile.id;
    cancelledSocial.cancelled_at = new Date();

    this.dispatchAction(cancelSocial({ social_id: this.social_id, social: cancelledSocial, notify: true }));
  }

  private updateForm(social: Social): void {
    this.socialCancelForm.controls.cancel_reason.setValue(social.cancel_reason);
  }

  private buildForm(): void {
    this.socialCancelForm = this.fb.group({
      cancel_reason: new UntypedFormControl(undefined, Validators.required),
    });

  }

}
