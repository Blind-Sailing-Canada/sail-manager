import {
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
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { Profile } from '../../../../../../api/src/types/profile/profile';
import { ProfileStatus } from '../../../../../../api/src/types/profile/profile-status';

import { ICDNState } from '../../../models/cdn-state.interface';
import { LoginState } from '../../../models/login-state';
import { FullRoutes } from '../../../routes/routes';
import { AuthService } from '../../../services/auth.service';
import {
  CDN_ACTION_STATE,
  uploadProfilePicture,
} from '../../../store/actions/cdn.actions';
import { logOut } from '../../../store/actions/login.actions';
import { updateProfileInfo } from '../../../store/actions/profile.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-profile-edit-page',
  templateUrl: './profile-edit-page.component.html',
  styleUrls: ['./profile-edit-page.component.scss']
})
export class ProfileEditPageComponent extends BasePageComponent implements OnInit {

  public ProfileStatus = ProfileStatus;
  public profileForm: UntypedFormGroup;
  public profilePictureInputId = 'profilePictureInput';
  public totalFormSteps = 5;

  private fileToUpload: File;
  private profile_id: string;
  public profile: Partial<Profile>;
  public saveError = '';
  public existingAccount = false;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(UntypedFormBuilder) private fb: UntypedFormBuilder,
    @Inject(AuthService) private authService: AuthService) {
    super(store, route, router);
  }

  ngOnInit() {
    this.buildForm();

    this.profile_id = this.route.snapshot.params.id;


    this.subscribeToStoreSlice(STORE_SLICES.LOGIN, (login: LoginState) => {
      if (this.profile_id !== 'new') {
        return;
      }

      this.profile = {
        bio: login.tokenData?.provider_user.bio || '',
        email: login.tokenData?.provider_user.email || '',
        name: login.tokenData?.provider_user.name || '',
        phone: login.tokenData?.provider_user.phone || '',
        photo: login.tokenData?.provider_user.photo || '',
        status: login.tokenData?.status,
      };

      this.updateForm();
    });


    if (this.profile_id === 'new') {
      return;
    }


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
      this.profile = profilesState?.profiles[this.profile_id];
      if (this.profile) {
        if (this.profile.status !== ProfileStatus.Registration && this.profile.status !== ProfileStatus.Approved) {
          this.goTo([FullRoutes.ACCOUNT_REVIEW], undefined);
        }
        this.updateForm();
      }
    });
  }

  public formErrors(controlName: string): string[] {
    const errors = Object
      .keys(this.profileForm.controls[controlName].errors || {})
      .map((errorKey) => {
        if (controlName === 'phone' && errorKey === 'pattern') {
          return 'Invalid phone number: must be 10 digits only.';
        }

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
    const should = !this.profileForm || !this.profileForm.valid;

    return should;
  }

  public async save() {
    if (this.profile.status === ProfileStatus.Registration) {
      const profile = this.profileForm.getRawValue();

      profile.phone = profile.phone.replace(/\+1/g, '').replace(/[^\d]/g, '').substring(0, 10);
      profile.email = profile.email.toLowerCase().trim();

      this.startLoading();
      const fetcher = this.authService.createProfile(profile);

      try {
        this.saveError = '';
        this.existingAccount = false;

        await firstValueFrom(fetcher).finally(() => this.finishLoading());

        this.dispatchAction(logOut({ message: 'Registration Submitted. You will be notified once your profile is approved.' }));
      } catch (error) {
        this.saveError = error.error?.message;

        const nameAlreadyExists = /Key \(name\)\=\(.{1,}\) already exists\./gi;
        const emailAlreadyExists = /Key \(email\)\=\(.{1,}\) already exists\./gi;

        if (nameAlreadyExists.test(this.saveError)) {
          this.existingAccount = true;
          this.saveError = 'An account with this name already exist.';
        }

        if (emailAlreadyExists.test(this.saveError)) {
          this.existingAccount = true;
          this.saveError = 'An account with this email already exists.';
        }

        this.dispatchError(error.error?.message || 'Unable to register your profile.');
        console.error(error);
      }

      return;
    }

    const formControls = this.profileForm.controls;
    const formKeys = Object.keys(formControls);
    const changedValue: Partial<Profile> = formKeys
      .filter(key => !formControls[key].pristine)
      .reduce(
        (red, key) => {
          red[key] = formControls[key].value ? formControls[key].value.trim() : null;
          if (key === 'phone') {
            red[key] = formControls[key].value.replace(/\+1/g, '').replace(/[^\d]/g, '').substring(0, 10);
          }
          return red;
        },
        {}
      ) as any;

    if (changedValue.email) {
      changedValue.email = changedValue.email.trim().toLowerCase();
    }

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
      name: new UntypedFormControl(null, [Validators.required, Validators.maxLength(100)]),
      email: new UntypedFormControl(null, [Validators.required, Validators.maxLength(150)]),
      phone: new UntypedFormControl(null, [Validators.pattern(/^\d{0,10}$/)]),
      photo: new UntypedFormControl(null, [Validators.pattern(/((?:https?:\/\/|cdn\/files\/images\/profiles).*\.(?:png|jpg|jpeg|gif))?/i)]),
      bio: new UntypedFormControl(null, Validators.maxLength(500)),
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
