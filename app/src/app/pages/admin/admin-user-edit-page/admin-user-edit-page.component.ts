import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  Store,
} from '@ngrx/store';
import { Profile } from '../../../../../../api/src/types/profile/profile';
import { ProfileReview, ProfileReviewAccess } from '../../../../../../api/src/types/profile/profile-review';
import { ProfileRole } from '../../../../../../api/src/types/profile/profile-role';
import { ProfileStatus } from '../../../../../../api/src/types/profile/profile-status';
import { RequiredAction } from '../../../../../../api/src/types/required-action/required-action';
import { RequiredActionStatus } from '../../../../../../api/src/types/required-action/required-action-status';
import { UserAccess } from '../../../../../../api/src/types/user-access/user-access';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';

import { RequiredActionsState } from '../../../models/required-actions.state';
import { viewProfileRoute } from '../../../routes/routes';
import { reviewProfile } from '../../../store/actions/profile.actions';
import {
  dismissRequiredAction,
} from '../../../store/actions/required-actions.actions';
import {
  fetchUserAccess,
} from '../../../store/actions/user-access.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-admin-user-edit-page',
  templateUrl: './admin-user-edit-page.component.html',
  styleUrls: ['./admin-user-edit-page.component.css']
})
export class AdminUserEditPageComponent extends BasePageComponent implements OnInit {

  private required_action_id: string = null;
  public UserAccessFields = UserAccessFields;
  public profileAccess: UserAccess = {} as UserAccess;
  public profileForm: FormGroup;
  public profileRoles = ProfileRole;
  public profileStatus = ProfileStatus;
  public requiredAction: RequiredAction = null;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(FormBuilder) private fb: FormBuilder,
  ) {
    super(store, route);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.required_action_id = this.route.snapshot.queryParams.completeRequiredAction;

    this.buildForm();

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES, () => {
      this.updateForm();
    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.USER_ACCESS, () => {
      this.profileAccess = this.store[STORE_SLICES.USER_ACCESS][this.profile_id];
      this.updateForm();
    });

    this.subscribeToStoreSlice(STORE_SLICES.REQUIRED_ACTIONS, (requiredActionsState: RequiredActionsState) => {
      this.requiredAction = requiredActionsState.actions[this.required_action_id];

      if (this.requiredAction && this.requiredAction.status !== RequiredActionStatus.New) {
        this.requiredAction = null;
      }

    });

    this.dispatchAction(fetchUserAccess({ profile_id: this.profile_id }));
  }

  public setStatus(status: string): void {
    const input = document.getElementById(`status_${status}-input`);
    input.click();
  }

  public dismissRequiredAction(): void {
    this.dispatchAction(dismissRequiredAction({ action_id: this.required_action_id, notify: true }));
  }

  private buildForm(): void {
    this.profileForm = this.fb.group({
      status: this.fb.control(null),
      roles: [],
      access: [],
    });

  }

  private updateForm(): void {
    const updatedForm: any = {};

    if (this.profileAccess) {
      const access = Object
        .keys((this.profileAccess || {}).access || {})
        .filter(key => this.profileAccess.access[key]);

      updatedForm.access = access;
    }

    if (this.profile) {
      updatedForm.status = this.profile.status;
      updatedForm.roles = this.profile.roles;
    }

    this.profileForm.patchValue(updatedForm);
    this.profileForm.markAsPristine();
    this.profileForm.markAsUntouched();
  }

  public clearRolesAccess(): void {
    this.profileForm.get('roles').setValue([]);
    this.profileForm.get('access').setValue([]);

    this.profileForm.updateValueAndValidity();
    this.profileForm.markAsDirty();
  }

  public get profile_id(): string {
    return this.route.snapshot.params.id;
  }

  public get profile(): Profile {
    return this.getProfile(this.profile_id);
  }

  public get shouldDisableSave(): boolean {
    const should = !this.profileForm.valid || !this.profileForm.dirty;

    return should;
  }

  public saveProfile(): void {
    const profileReview: Partial<ProfileReview> = {};

    const data: any = Object.keys(this.profileForm.controls)
      .filter(control => this.profileForm.get(control).dirty)
      .reduce(
        (red, control) => {
          red[control] = this.profileForm.get(control).value;
          return red;
        },
        {},
      );

    const access = data.access;

    if (access) {
      const changedAccess: ProfileReviewAccess = access
        .reduce(
          (red, key) => {
            red[key] = true;
            return red;
          },
          {},
        );

      profileReview.access = changedAccess;
    }

    if (data.status) {
      profileReview.status = data.status;
    }

    if (data.roles) {
      profileReview.roles = data.roles;
    }

    if (this.required_action_id) {
      profileReview.required_action_id = this.required_action_id;
    }

    this.dispatchAction(reviewProfile({
      profileReview,
      id: this.profile_id,
      notify: true,
    }));
  }

  public viewProfile(id): string {
    return viewProfileRoute(id);
  }
}
