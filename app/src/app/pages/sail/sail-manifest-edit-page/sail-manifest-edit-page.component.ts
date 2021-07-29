import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
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
  styleUrls: ['./sail-manifest-edit-page.component.css']
})
export class SailManifestEditPageComponent extends BasePageComponent implements OnInit {

  public manifestForm: FormGroup;
  public availableSailors: Profile[] = [];
  public usersOnSail: Profile[] = [];
  public SAILOR_ROLES = Object.entries(SailorRole);
  public sailorRoles: any = [];
  private addSailorDialogRef: MatDialogRef<AddSailorDialogComponent>;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(SailManifestService) private sailManifestService: SailManifestService,
    public dialog: MatDialog,
  ) {
    super(store, route, router, dialog);
    this.buildForm();
  }

  ngOnInit(): void {
    this.getSail(this.sailId);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS, () => {
      if (this.sail) {
        console.log('updating form', this.sail);
        this.updateForm(this.sail);
      }
    });
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
      addGuest: (guestName, guestOfId) => this.addGuest(guestName, guestOfId),
      usersOnSail: this.usersOnSail,
      sail: this.sail,
      guestName: '',
      guestOfId: this.usersOnSail[0]?.id,
    };

    this.dialog
      .open(AddGuestDialogComponent, {
        width: '90%',
        maxWidth: 500,
        data: dialogData,
      });
  }

  private buildForm(): void {
    this.manifestForm = this.fb.group({
      manifest: this.fb.array([]),
    });
  }

  private updateForm(sail: Sail): void {
    this.usersOnSail = [];
    this.sailorRoles = [];

    const manifestControls = sail.manifest.map((manifest) => {

      if (manifest.profile) {
        this.usersOnSail.push(manifest.profile);
      }

      this.buildSailorRoles(manifest.profile || {});

      const newManifestForm = this.fb.group({
        guestOfId: this.fb.control(manifest.guestOfId),
        id: this.fb.control(manifest.id),
        personName: this.fb.control(manifest.personName, Validators.required),
        profileId: this.fb.control(manifest.profileId),
        sailId: this.fb.control(this.sailId),
        sailorRole: this.fb.control(manifest.sailorRole),
      });

      newManifestForm.setParent(this.manifestForm);

      return newManifestForm;
    });

    this.manifestForm.controls.manifest = this.fb.array(manifestControls);
    this.manifestForm.controls.manifest.setParent(this.manifestForm);

    this.manifestForm.markAsUntouched();
    this.manifestForm.markAsPristine();
  }

  public get manifestControls() {
    return (this.manifestForm.controls.manifest as FormArray).controls as FormGroup[];
  }

  public addGuest(name: string, guestOfId: string): void {
    console.log(name);
    console.log(guestOfId);

    this.addSailor({ name }, SailorRole.Guest, guestOfId);
  }

  public isGuest(role: SailorRole): boolean {
    return role === SailorRole.Guest;
  }

  public addSailor(sailor: Partial<Profile>, role: SailorRole = SailorRole.Sailor, guestOfId?: string): void {
    (this.manifestForm.controls.manifest as FormArray).push(this.fb.group({
      guestOfId: this.fb.control(guestOfId),
      id: this.fb.control(undefined),
      personName: this.fb.control(sailor.name, Validators.required),
      profileId: this.fb.control(sailor.id),
      sailId: this.fb.control(this.sailId),
      sailorRole: this.fb.control(role),
    }));

    this.manifestForm.updateValueAndValidity();
    this.manifestForm.markAsDirty();

    if (!!sailor.id) {
      this.usersOnSail.push(sailor as Profile);
    }

    this.buildSailorRoles(sailor);

    this.availableSailors = this.availableSailors.filter(availableSailor => availableSailor.id !== sailor.id);
  }

  private buildSailorRoles(sailor: Partial<Profile>): void {
    const profile = this.usersOnSail.find(user => user.id === sailor.id);

    if (!profile) {
      this.sailorRoles.push([['Guest', SailorRole.Guest]]);
      return;
    }

    const profileRoles = profile.roles.map(role => role.toLowerCase());

    const roles = Object.entries(SailorRole).filter(role => profileRoles.includes(role[1]));

    roles.push(['Sailor', SailorRole.Sailor]);

    this.sailorRoles.push(roles);
  }

  public removeSailor(index: number): void {
    (this.manifestForm.controls.manifest as FormArray).removeAt(index);
    this.manifestForm.updateValueAndValidity();
    this.manifestForm.markAsDirty();

    this.usersOnSail.splice(index, 1);
    this.sailorRoles.splice(index, 1);
  }

  public get sailId(): string {
    return this.route.snapshot.params.id;
  }

  public get title(): string {
    return 'Edit Sail Manifest Form';
  }

  public get subtitle(): string {
    return `For sail: ${(this.sail || {}).name}`;
  }

  public get sail(): Sail {
    return this.sails[this.sailId];
  }

  public fetchAvailableSailor(sailorName: string): void {
    this.sailManifestService
      .getAvailableSailors(this.sail.start, this.sail.end, sailorName)
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

  public get shoulEnableSubmitButton(): boolean {
    return this.manifestForm.dirty && !this.occupanyExceeded;
  }

  public get occupanyExceeded(): boolean {
    const manifest = this.manifestForm.getRawValue().manifest as SailManifest[];

    return manifest.length > this.sail.maxOccupancy;
  }

  public submitForm(): void {
    const manifest = this.manifestForm.getRawValue().manifest;

    this.sailManifestService
      .updateManifest(this.sailId, manifest)
      .subscribe(sail => this.dispatchAction(putSail({ sail, id: this.sailId })));
  }

}
