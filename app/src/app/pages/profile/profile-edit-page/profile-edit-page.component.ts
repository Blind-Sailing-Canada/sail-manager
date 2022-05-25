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
import { FullRoutes } from '../../../routes/routes';
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

  public ProfileStatus = ProfileStatus;
  public profileForm: FormGroup;
  public profilePictureInputId = 'profilePictureInput';
  public totalFormSteps = 5;

  private fileToUpload: File;
  private profile_id: string;


  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder) {
    super(store, route, router);
  }

  ngOnInit() {
    this.profile_id = this.route.snapshot.params.id;

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
      const profile = profilesState?.profiles[this.profile_id];
      if (profile) {
        if (profile.status !== ProfileStatus.Registration && profile.status !== ProfileStatus.Approved) {
          this.goTo([FullRoutes.ACCOUNT_REVIEW], undefined);
        }
        this.updateForm();
      }
    });
  }

  public get profile(): Profile {
    return this.getProfile(this.profile_id);
  }

  public formErrors(controlName: string): string[] {
    const errors = Object
      .keys(this.profileForm.controls[controlName].errors || {})
      .map((errorKey) => {
        const error = this.profileForm.controls[controlName].errors[errorKey];

        if (errorKey === 'maxlength') {
          return `${controlName} cannot exceed ${error.requiredLength} characters.`;
        } else if (errorKey === 'required') {
          return `${controlName} cannot be blank.`;
        } else {
          return errorKey;
        }
      });
    return errors;
  }

  public get shouldHideUpdateButton(): boolean {
    const isRegistration = this.profile.status === ProfileStatus.Registration;

    if (isRegistration && !this.profileForm.dirty) {
      // exit early the form should already be valid during registration
      return false;
    }

    const should = !this.profileForm || !this.profileForm.dirty || !this.profileForm.valid;

    return should;
  }

  public save(): void {
    if (this.profile.status === ProfileStatus.Registration) {
      const profile = this.profileForm.getRawValue();

      profile.phone = profile.phone.replace(/\+1/g, '').replace(/[^\d]/g,'').substring(0, 10);

      this.dispatchAction(updateProfileInfo({ profile, profile_id: this.profile_id }));
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
    this.dispatchAction(updateProfileInfo({ profile_id: this.profile_id, profile: changedValue, notify: true }));
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
    this.dispatchAction(uploadProfilePicture({ file: files[0], profile_id: this.profile_id, notify: true }));
  }

  private buildForm(): void {
    this.profileForm = this.fb.group({
      name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      email: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
      phone: new FormControl(null),
      photo: new FormControl(null),
      bio: new FormControl(null, Validators.maxLength(500)),
    });
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
      this.totalFormSteps = 4;
    }

    this.profileForm.markAsPristine();
  }
}
