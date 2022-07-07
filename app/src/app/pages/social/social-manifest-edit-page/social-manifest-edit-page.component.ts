import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { takeWhile } from 'rxjs/operators';
import { Profile } from '../../../../../../api/src/types/profile/profile';
import { ProfileRole } from '../../../../../../api/src/types/profile/profile-role';
import { SocialManifest } from '../../../../../../api/src/types/social-manifest/social-manifest';
import { Social } from '../../../../../../api/src/types/social/social';
import { AddSocialAttendantDialogComponent } from '../../../components/add-social-attendant-dialog/add-social-attendant-dialog.component';
import { AddSocialGuestDialogComponent } from '../../../components/add-social-guest-dialog/add-social-guest-dialog.component';
import { AddSocialAttendantDialogData } from '../../../models/add-social-attendant-dialog-data.interface';
import { AddSocialGuestDialogData } from '../../../models/add-social-guest-dialog-data.interface';
import { SocialManifestService } from '../../../services/social-manifest.service';
import { putSocial } from '../../../store/actions/social.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-social-manifest-edit-page',
  templateUrl: './social-manifest-edit-page.component.html',
  styleUrls: ['./social-manifest-edit-page.component.css']
})
export class SocialManifestEditPageComponent extends BasePageComponent implements OnInit {

  private addSocialAttendantDialogRef: MatDialogRef<AddSocialAttendantDialogComponent>;
  public availableProfiles: Profile[] = [];
  public manifestForm: UntypedFormGroup;
  public social: Social;
  public social_id: string;
  public usersOnSocial: Profile[] = [];

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(UntypedFormBuilder) private fb: UntypedFormBuilder,
    @Inject(SocialManifestService) private socialManifestService: SocialManifestService,
    public dialog: MatDialog,
  ) {
    super(store, route, router, dialog);
    this.buildForm();
  }

  ngOnInit(): void {
    this.social_id = this.route.snapshot.params.id;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.SOCIALS, () => {
      this.social = this.getSocial(this.social_id);

      if (this.social) {
        this.updateForm(this.social);
      }
    });
    this.getSocial(this.social_id);
  }

  public showAddSocialAttendantDialog(): void {
    const dialogData: AddSocialAttendantDialogData = {
      addAttendant: user => this.addAttendant(user),
      profiles: this.availableProfiles,
      fetchProfile: name => this.fetchAvailableUsers(name),
      social: this.social,
    };

    this.addSocialAttendantDialogRef = this.dialog
      .open(AddSocialAttendantDialogComponent, {
        width: '90%',
        maxWidth: 500,
        data: dialogData,
      });
  }

  public showAddGuestDialog(): void {
    const dialogData: AddSocialGuestDialogData = {
      addGuest: (guestName, guest_of_id) => this.addGuest(guestName, guest_of_id),
      guestName: '',
      guest_of_id: this.usersOnSocial[0]?.id,
      social: this.social,
      usersOnSocial: this.usersOnSocial,
    };

    this.dialog
      .open(AddSocialGuestDialogComponent, {
        width: '90%',
        maxWidth: 500,
        data: dialogData,
      });
  }


  public get manifestControls() {
    return (this.manifestForm.controls.manifest as UntypedFormArray).controls as UntypedFormGroup[];
  }

  public addGuest(name: string, guest_of_id: string): void {
    this.addAttendant({ name }, guest_of_id);
  }

  public addAttendant(user: Partial<Profile>, guest_of_id?: string): void {
    (this.manifestForm.controls.manifest as UntypedFormArray).push(this.fb.group({
      guest_of_id: this.fb.control(guest_of_id),
      id: this.fb.control(undefined),
      is_guest: this.fb.control(!!guest_of_id),
      person_name: this.fb.control(user.name, Validators.required),
      profile_id: this.fb.control(user.id),
      social_id: this.fb.control(this.social_id),
    }));

    this.manifestForm.updateValueAndValidity();
    this.manifestForm.markAsDirty();

    if (!!user.id) {
      this.usersOnSocial.push(user as Profile);
    }

    this.availableProfiles = this.availableProfiles.filter(profile => profile.id !== user.id);
  }

  public removeAttendant(index: number): void {
    (this.manifestForm.controls.manifest as UntypedFormArray).removeAt(index);
    this.manifestForm.updateValueAndValidity();
    this.manifestForm.markAsDirty();

    this.usersOnSocial.splice(index, 1);
  }

  public get title(): string {
    return 'Edit Social Manifest Form';
  }

  public get subtitle(): string {
    return `For social: ${(this.social || {}).name}`;
  }

  public fetchAvailableUsers(userName: string): void {
    this.socialManifestService
      .getAvailableUsers(this.social.start_at, this.social.end_at, userName)
      .pipe(takeWhile(() => this.active))
      .subscribe((profiles) => {
        this.availableProfiles = profiles.filter(profile => !this.usersOnSocial.some(user => user.id === profile.id));

        if (this.addSocialAttendantDialogRef && this.addSocialAttendantDialogRef.componentInstance) {
          this.addSocialAttendantDialogRef.componentInstance.data = {
            ...this.addSocialAttendantDialogRef.componentInstance.data,
            profiles: this.availableProfiles,
          };
        }
      });
  }

  public get shouldEnableSubmitButton(): boolean {
    const isUserSpecial = this.user.roles.some(role => [ProfileRole.Admin, ProfileRole.Coordinator].includes(role));

    return this.manifestForm.dirty && (!this.occupancyExceeded || isUserSpecial);
  }

  public get occupancyExceeded(): boolean {
    const manifest = this.manifestForm.getRawValue().manifest as SocialManifest[];

    return this.social.max_attendants !== -1 && manifest.length > this.social.max_attendants;
  }

  public submitForm(): void {
    const manifest = this.manifestForm.getRawValue().manifest;

    this.socialManifestService
      .updateManifest(this.social_id, manifest)
      .subscribe(social => {
        this.dispatchAction(putSocial({ social, id: this.social_id }));
        this.dispatchMessage('Manifest saved');
      });
  }


  private buildForm(): void {
    this.manifestForm = this.fb.group({
      manifest: this.fb.array([]),
    });
  }


  private updateForm(social: Social): void {
    this.usersOnSocial = [];

    const manifestControls = social.manifest.map((manifest) => {

      if (manifest.profile) {
        this.usersOnSocial.push(manifest.profile);
      }

      const newManifestForm = this.fb.group({
        guest_of_id: this.fb.control(manifest.guest_of_id),
        id: this.fb.control(manifest.id),
        person_name: this.fb.control(manifest.person_name, Validators.required),
        profile_id: this.fb.control(manifest.profile_id),
        social_id: this.fb.control(this.social_id),
        is_guest: this.fb.control(!!manifest.guest_of_id),
      });

      newManifestForm.setParent(this.manifestForm);

      return newManifestForm;
    });

    this.manifestForm.controls.manifest = this.fb.array(manifestControls);
    this.manifestForm.controls.manifest.setParent(this.manifestForm);

    this.manifestForm.markAsUntouched();
    this.manifestForm.markAsPristine();
  }

}
