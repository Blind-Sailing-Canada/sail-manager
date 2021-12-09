import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { SailRequest } from '../../../../../../api/src/types/sail-request/sail-request';
import { SailRequestStatus } from '../../../../../../api/src/types/sail-request/sail-request-status';
import { SailCategory } from '../../../../../../api/src/types/sail/sail-category';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';
import { fetchSailCategories } from '../../../store/actions/sail-category.actions';
import {
  cancelSailRequest,
  createSailRequest,
  expireSailRequest,
  updateSailRequest,
} from '../../../store/actions/sail-request.actions';
import { STORE_SLICES } from '../../../store/store';
import { SailRequestBasePageComponent } from '../sail-request-base-page/sail-request-base-page.component';

@Component({
  selector: 'app-sail-request-edit-page',
  templateUrl: './sail-request-edit-page.component.html',
  styleUrls: ['./sail-request-edit-page.component.css']
})
export class SailRequestEditPageComponent extends SailRequestBasePageComponent implements OnInit {

  public form: FormGroup;
  public requestStatusValues = Object.values(SailRequestStatus);
  public sailCategories: SailCategory[] = [];

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    super.ngOnInit();
    this.buildForm();

    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAIL_REQUESTS, () => {
      const sailRequest = this.sailRequest;

      if (sailRequest) {
        this.updateForm(sailRequest);
      }
    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAIL_CATEGORIES, (categories) => {
      this.sailCategories = Object.values(categories || {});
    });

    this.dispatchAction(fetchSailCategories({ notify: false }));
  }

  public get title(): string {
    return this.sail_request_id ? 'Edit Sail Request Form' : 'New Sail Request Form';
  }

  public formErrors(controlName: string): string[] {
    const errors = Object.keys(this.form.controls[controlName].errors || {});
    return errors;
  }

  public get shouldDisableUpdateButton(): boolean {
    const should = this.loading ||
      !this.form
      || !this.form.valid
      || !this.form.dirty;

    return !!should;
  }

  public get shouldDisableCreateButton(): boolean {
    const should = this.loading || !this.form || !this.form.valid || !this.form.dirty;

    return should;
  }

  public get creating(): boolean {
    return !this.sail_request_id;
  }

  public create(): void {
    const sailRequest: Partial<SailRequest> = this.form.getRawValue();

    this.dispatchAction(createSailRequest({ sailRequest }));
  }

  public update(): void {
    const formControls = this.form.controls;
    const formKeys = Object.keys(formControls);
    const changedValue = formKeys
      .filter(key => !formControls[key].pristine)
      .reduce(
        (red, key) => {
          const value = formControls[key].value;

          if (typeof value === 'string') {
            red[key] = value.trim();
          } else {
            red[key] = value ? value : null;
          }

          return red;
        },
        {}
      ) as any;

    this.dispatchAction(updateSailRequest({ id: this.sail_request_id, sailRequest: changedValue }));
  }

  public cancelRequest(): void {
    this.dispatchAction(cancelSailRequest({ id: this.sail_request_id }));
  }

  public expireRequest(): void {
    this.dispatchAction(expireSailRequest({ id: this.sail_request_id }));
  }

  public get shouldShowControls(): boolean {
    return !!this.sail_request_id;
  }

  public get shouldShowCancelButton() {
    if (this.sailRequest.status !== SailRequestStatus.New) {
      return false;
    }

    return this.shouldShowControls && this.user.profile.id === this.sailRequest.requested_by_id;
  }

  public get shouldShowStatusInput() {
    return this.shouldShowControls && this.user.access[UserAccessFields.EditSailRequest];
  }

  private updateForm(sailRequest: SailRequest): void {
    this.form.patchValue(sailRequest);
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      requested_by_id: this.fb.control(this.user.profile.id, Validators.required),
      details: this.fb.control(undefined, Validators.required),
      category: this.fb.control(''),
      status: this.fb
        .control({ value: SailRequestStatus.New, disabled: this.creating || !this.shouldShowStatusInput }, Validators.required),
    });
  }
}
