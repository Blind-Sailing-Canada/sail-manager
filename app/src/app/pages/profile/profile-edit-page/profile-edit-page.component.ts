import {
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
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Profile } from '../../../../../../api/src/types/profile/profile';
import { ProfileStatus } from '../../../../../../api/src/types/profile/profile-status';

import { ICDNState } from '../../../models/cdn-state.interface';
import { FULL_ROUTES } from '../../../routes/routes';
import {
  CDN_ACTION_STATE,
  uploadProfilePicture,
} from '../../../store/actions/cdn.actions';
import { updateProfileInfo } from '../../../store/actions/profile.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-profile-edit-page',
  templateUrl: './profile-edit-page.component.html',
  styleUrls: ['./profile-edit-page.component.css']
})
export class ProfileEditPageComponent extends BasePageComponent implements OnInit {

  private fileToUpload: File;
  private profileId: string;
  public ProfileStatus = ProfileStatus;
  public profileForm: FormGroup;
  public profilePictureInputId = 'profilePictureInput';

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder) {
    super(store, route, router);
  }

  ngOnInit() {
    this.profileId = this.route.snapshot.params.id;

    this.buildForm();

    this.subscribeToStoreSliceWithUser(STORE_SLICES.CDN, (cdn: ICDNState) => {
      if (!this.fileToUpload) {
        return;
      }

      const fileName = this.fileToUpload.name;
      if (cdn[fileName].state === CDN_ACTION_STATE.ERROR) {
        this.fileToUpload = null;

        const fileInput = document.getElementById(this.profilePictureInputId) as HTMLInputElement;

        if (fileInput) {
          fileInput.value = null;
        }
      }

      if (cdn[fileName].state === CDN_ACTION_STATE.UPLOADED) {
        this.profileForm.controls.photo.patchValue(this.cdn[fileName].url);
        this.profileForm.controls.photo.markAsDirty();
        this.profileForm.markAsDirty();
        this.fileToUpload = null;

        const fileInput = document.getElementById(this.profilePictureInputId) as HTMLInputElement;

        if (fileInput) {
          fileInput.value = null;
        }

      }
    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES, (profilesState) => {
      const profile = profilesState?.profiles[this.profileId];
      if (profile) {
        if (profile.status !== ProfileStatus.Registration && profile.status !== ProfileStatus.Approved) {
          this.goTo([FULL_ROUTES.ACCOUNT_REVIEW], undefined);
        }
        this.updateForm();
      }
    });
  }

  public get profile(): Profile {
    return this.getProfile(this.profileId);
  }

  private buildForm(): void {
    this.profileForm = this.fb.group({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      phone: new FormControl(null),
      photo: new FormControl(null),
      bio: new FormControl(null),
    });
  }

  public formErrors(controlName: string): string[] {
    const errors = Object.keys(this.profileForm.controls[controlName].errors || {});
    return errors;
  }

  private updateForm(): void {
    const profile = this.profile;
    const controls = Object.keys(this.profileForm.controls);

    controls
      .forEach(control => this.profileForm
        .controls[control]
        .patchValue(profile[control]));

    if (this.profile.status === ProfileStatus.Registration) {
      this.profileForm.controls.photo.disable();
    }

    this.profileForm.markAsPristine();
  }

  public get shouldHideUpdateButton(): boolean {
    const isRegistration = this.profile.status === ProfileStatus.Registration;

    if (isRegistration) {
      // exit early the form should already be valid during registration
      return false;
    }

    const should = !this.profileForm || !this.profileForm.dirty || !this.profileForm.valid;

    return should;
  }

  public save(): void {
    if (this.profile.status === ProfileStatus.Registration) {
      const profile = this.profileForm.getRawValue();
      this.dispatchAction(updateProfileInfo({ profile, id: this.profileId }));
      return;
    }

    const formControls = this.profileForm.controls;
    const formKeys = Object.keys(formControls);
    const changedValue = formKeys
      .filter(key => !formControls[key].pristine)
      .reduce(
        (red, key) => {
          red[key] = formControls[key].value ? formControls[key].value.trim() : null;
          return red;
        },
        {}
      ) as any;
    this.dispatchAction(updateProfileInfo({ id: this.profileId, profile: changedValue, notify: true }));
  }

  public get isNewRegistration(): boolean {
    return this.profile && this.profile.status === ProfileStatus.Registration;
  }

  public get title(): string {
    return this.profile.status === ProfileStatus.Registration ? 'Account Registration' : this.profile.name;
  }

  public get uploadProgress(): number {
    return this.fileToUpload ? this.cdn[this.fileToUpload.name].progress : 0;
  }

  public uploadFileToCDN(files: File[]): void {
    this.fileToUpload = files[0];
    this.dispatchAction(uploadProfilePicture({ file: files[0], profileId: this.profileId, notify: true }));
  }
}
