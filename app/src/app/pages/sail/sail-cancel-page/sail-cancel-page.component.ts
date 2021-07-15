import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
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
  public sailCancelForm: FormGroup;
  public sailId: string;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(FormBuilder) private fb: FormBuilder,
  ) {
    super(store, route);
  }

  ngOnInit() {
    this.sailId = this.route.snapshot.params.id;

    this.buildForm();
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS, () => {
      const sail = this.sails[this.sailId];

      if (!sail && sail !== null) {
        this.fetchSail(this.sailId);
        return;
      }

      this.updateForm(sail);

    });

  }

  private updateForm(sail: Sail): void {
    this.sailCancelForm.controls.cancelReason.setValue(sail.cancelReason);
  }

  private buildForm(): void {
    this.sailCancelForm = this.fb.group({
      cancelReason: new FormControl(undefined, Validators.required),
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
    cancelledSail.cancelledById = this.user.profile.id;
    cancelledSail.cancelledAt = new Date();

    this.dispatchAction(cancelSail({ id: this.sailId, sail: cancelledSail, notify: true }));
  }

}
