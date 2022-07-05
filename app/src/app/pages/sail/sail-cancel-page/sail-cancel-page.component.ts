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
import { Sail } from '../../../../../../api/src/types/sail/sail';

import { cancelSail } from '../../../store/actions/sail.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-sail-edit-page',
  templateUrl: './sail-cancel-page.component.html',
  styleUrls: ['./sail-cancel-page.component.css']
})
export class SailCancelPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
  public sailCancelForm: UntypedFormGroup;
  public sail_id: string;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(UntypedFormBuilder) private fb: UntypedFormBuilder,
  ) {
    super(store, route);
  }

  ngOnInit() {
    this.sail_id = this.route.snapshot.params.id;

    this.buildForm();
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS, () => {
      const sail = this.sails[this.sail_id];

      if (!sail && sail !== null) {
        this.fetchSail(this.sail_id);
        return;
      }

      this.updateForm(sail);

    });

  }

  public get shouldEnableSubmitButton(): boolean {
    if (!this.sailCancelForm) {
      return false;
    }

    return this.sailCancelForm.dirty && this.sailCancelForm.valid;
  }

  public submitCancelForm(): void {
    const cancelledSail: Sail = this.sailCancelForm.value;
    cancelledSail.cancelled_by_id = this.user.profile.id;
    cancelledSail.cancelled_at = new Date();

    this.dispatchAction(cancelSail({ sail_id: this.sail_id, sail: cancelledSail, notify: true }));
  }

  private updateForm(sail: Sail): void {
    this.sailCancelForm.controls.cancel_reason.setValue(sail.cancel_reason);
  }

  private buildForm(): void {
    this.sailCancelForm = this.fb.group({
      cancel_reason: new UntypedFormControl(undefined, Validators.required),
    });

  }

}
