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
import { SailManifest } from '../../../../../../api/src/types/sail-manifest/sail-manifest';
import { SailorRole } from '../../../../../../api/src/types/sail-manifest/sailor-role';
import { Sail } from '../../../../../../api/src/types/sail/sail';
import { AddGuestDialogComponent } from '../../../components/add-guest-dialog/add-guest-dialog.component';
import { AddSailorDialogComponent } from '../../../components/add-sailor-dialog/add-sailor-dialog.component';
import { AddGuestDialogData } from '../../../models/add-guest-dialog-data.interface';
import { AddSailorDialogData } from '../../../models/add-sailor-dialog-data.interface';
import { SailManifestService } from '../../../services/sail-manifest.service';
import { putSail } from '../../../store/actions/sail.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-sail-manifest-edit-page',
  templateUrl: './sail-manifest-edit-page.component.html',
  styleUrls: ['./sail-manifest-edit-page.component.scss']
})
export class SailManifestEditPageComponent extends BasePageComponent implements OnInit {

  public manifestForm: UntypedFormGroup;
  public availableSailors: Profile[] = [];
  public usersOnSail: Profile[] = [];
  public SAILOR_ROLES = Object.entries(SailorRole);
  public sailor_roles: any = [];
  public sail: Sail;
  public sail_id: string;
  private addSailorDialogRef: MatDialogRef<AddSailorDialogComponent>;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(UntypedFormBuilder) private fb: UntypedFormBuilder,
    @Inject(SailManifestService) private sailManifestService: SailManifestService,
    public dialog: MatDialog,
  ) {
    super(store, route, router, dialog);
    this.buildForm();
  }

  ngOnInit(): void {
    this.sail_id = this.route.snapshot.params.id;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS, () => {
      this.sail = this.getSail(this.sail_id);

      if (this.sail) {
        this.updateForm(this.sail);
      }
    });
    this.getSail(this.sail_id);
  }

  public showAddSailorDialog(): void {
    const dialogData: AddSailorDialogData = {
      addSailor: sailor => this.addSailor(sailor),
      availableSailors: this.availableSailors,
      fetchAvailableSailor: name => this.fetchAvailableSailor(name),
      sail: this.sail,
    };

    this.addSailorDialogRef = this.dialog
      .open(AddSailorDialogComponent, {
        width: '90%',
        maxWidth: 500,
        data: dialogData,
      });
  }

  public showAddGuestDialog(): void {
    const dialogData: AddGuestDialogData = {
      addGuest: (guestName, guest_of_id) => this.addGuest(guestName, guest_of_id),
      usersOnSail: this.usersOnSail,
      sail: this.sail,
      guestName: '',
      guest_of_id: this.usersOnSail[0]?.id,
    };

    this.dialog
      .open(AddGuestDialogComponent, {
        width: '90%',
        maxWidth: 500,
        data: dialogData,
      });
  }


  public get manifestControls() {
    return (this.manifestForm.controls.manifest as UntypedFormArray).controls as UntypedFormGroup[];
  }

  public addGuest(name: string, guest_of_id: string): void {
    this.addSailor({ name }, SailorRole.Guest, guest_of_id);
  }

  public isGuest(role: SailorRole): boolean {
    return role === SailorRole.Guest;
  }

  public addSailor(sailor: Partial<Profile>, role: SailorRole = SailorRole.Sailor, guest_of_id?: string): void {
    (this.manifestForm.controls.manifest as UntypedFormArray).push(this.fb.group({
      guest_of_id: this.fb.control(guest_of_id),
      id: this.fb.control(undefined),
      person_name: this.fb.control(sailor.name, Validators.required),
      profile_id: this.fb.control(sailor.id),
      sail_id: this.fb.control(this.sail_id),
      sailor_role: this.fb.control(role),
    }));

    this.manifestForm.updateValueAndValidity();
    this.manifestForm.markAsDirty();

    if (!!sailor.id) {
      this.usersOnSail.push(sailor as Profile);
    }

    this.buildSailorRoles(sailor);

    this.availableSailors = this.availableSailors.filter(availableSailor => availableSailor.id !== sailor.id);
  }

  public removeSailor(index: number): void {
    (this.manifestForm.controls.manifest as UntypedFormArray).removeAt(index);
    this.manifestForm.updateValueAndValidity();
    this.manifestForm.markAsDirty();

    this.usersOnSail.splice(index, 1);
    this.sailor_roles.splice(index, 1);
  }

  public get title(): string {
    return 'Edit Sail Manifest Form';
  }

  public get subtitle(): string {
    return `For sail: ${(this.sail || {}).name}`;
  }

  public fetchAvailableSailor(sailorName: string): void {
    this.sailManifestService
      .getAvailableSailors(this.sail.start_at, this.sail.end_at, sailorName)
      .pipe(takeWhile(() => this.active))
      .subscribe((availableSailors) => {
        this.availableSailors = availableSailors.filter(sailor => !this.usersOnSail.some(user => user.id === sailor.id));

        if (this.addSailorDialogRef && this.addSailorDialogRef.componentInstance) {
          this.addSailorDialogRef.componentInstance.data = {
            ...this.addSailorDialogRef.componentInstance.data,
            availableSailors: this.availableSailors,
          };
        }
      });
  }

  public get shouldEnableSubmitButton(): boolean {
    const isUserSpecial = this.user.roles.some(role => [ProfileRole.Admin, ProfileRole.Coordinator].includes(role));

    return this.manifestForm.dirty && (!this.occupancyExceeded || isUserSpecial);
  }

  public get occupancyExceeded(): boolean {
    const manifest = this.manifestForm.getRawValue().manifest as SailManifest[];

    return manifest.length > this.sail.max_occupancy;
  }

  public submitForm(): void {
    const manifest = this.manifestForm.getRawValue().manifest;

    this.sailManifestService
      .updateManifest(this.sail_id, manifest)
      .subscribe(sail => {
        this.dispatchAction(putSail({ sail, id: this.sail_id }));
        this.dispatchMessage('Manifest saved');
      });
  }


  private buildForm(): void {
    this.manifestForm = this.fb.group({
      manifest: this.fb.array([]),
    });
  }

  private buildSailorRoles(sailor: Partial<Profile>): void {
    const profile = this.usersOnSail.find(user => user.id === sailor.id);

    if (!profile) {
      this.sailor_roles.push([['Guest', SailorRole.Guest]]);
      return;
    }

    const profileRoles = profile.roles.map(role => role.toLowerCase());

    const roles = Object.entries(SailorRole).filter(role => profileRoles.includes(role[1]));

    roles.push(['Sailor', SailorRole.Sailor]);

    this.sailor_roles.push(roles);
  }


  private updateForm(sail: Sail): void {
    this.usersOnSail = [];
    this.sailor_roles = [];

    const manifestControls = sail.manifest.map((manifest) => {

      if (manifest.profile) {
        this.usersOnSail.push(manifest.profile);
      }

      this.buildSailorRoles(manifest.profile || {});

      const newManifestForm = this.fb.group({
        guest_of_id: this.fb.control(manifest.guest_of_id),
        id: this.fb.control(manifest.id),
        person_name: this.fb.control(manifest.person_name, Validators.required),
        profile_id: this.fb.control(manifest.profile_id),
        sail_id: this.fb.control(this.sail_id),
        sailor_role: this.fb.control(manifest.sailor_role),
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
