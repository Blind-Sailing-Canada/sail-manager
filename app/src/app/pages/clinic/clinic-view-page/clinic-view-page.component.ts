import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Clinic } from '../../../../../../api/src/types/clinic/clinic';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';
import {
  editClinicRoute,
} from '../../../routes/routes';
import {
  enrollInClinic,
  graduateUserFromClinic,
  leaveClinic,
  removeUserFromClinic,
} from '../../../store/actions/clinic.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-clinic-view-page',
  templateUrl: './clinic-view-page.component.html',
  styleUrls: ['./clinic-view-page.component.css']
})
export class ClinicViewPageComponent extends BasePageComponent implements OnInit {

  public clinic: Clinic;
  public clinicId: string;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.clinicId = this.route.snapshot.params.clinicId;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CLINICS, () => {
      this.clinic = (this.store[STORE_SLICES.CLINICS] || {})[this.clinicId];

      if (this.clinicId && this.clinic === undefined) {
        this.clinic = this.getClinic(this.clinicId);
      }
    });
  }

  public get shouldEnableEditButton(): boolean {
    return !!this.user.access[UserAccessFields.EditClinic] || this.user.profile.id === this.clinic.instructorId;
  }

  public editClinic(): void {
    this.goTo([editClinicRoute(this.clinicId)]);
  }

  public get shouldEnableEnrollButton(): boolean {
    return !(this.clinic.attendance || []).some(attendant => attendant.attendantId === this.user.profile.id);
  }

  public enrollInClinic(): void {
    this.dispatchAction(enrollInClinic({ clinicId: this.clinicId, profileId: this.user.profile.id, notify: true }));
  }

  public disenrollFromClinic(): void {
    this.dispatchAction(leaveClinic({ clinicId: this.clinicId, profileId: this.user.profile.id, notify: true }));
  }

  public get shouldEnableDisenrollButton(): boolean {
    return (this.clinic.attendance || []).some(attendant => attendant.attendantId === this.user.profile.id);
  }

  public removeUserFromClinic(profileId: string): void {
    this.dispatchAction(removeUserFromClinic({ profileId, clinicId: this.clinicId, notify: true }));
  }

  public graduateUserFromClinic(profileId: string): void {
    this.dispatchAction(graduateUserFromClinic({ profileId, clinicId: this.clinicId, notify: true }));
  }

  public get shouldEnableEditEnrollmentButton(): boolean {
    return !!this.user.access[UserAccessFields.EditClinic] || this.user.profile.id === this.clinic.instructorId;
  }

  public get shouldEnableGraduateButton(): boolean {
    return this.clinic.instructorId === this.user.profile.id;
    return true;
  }

  public get shouldEnableRemoveButton(): boolean {
    return !!this.user.access[UserAccessFields.EditClinic] || this.clinic.instructorId === this.user.profile.id;
  }

}
