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
import { EntityType } from '../../../models/entity-type';
import {
  editClinicRoute, listDocumentsRoute,
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
  public clinic_id: string;

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

    this.clinic_id = this.route.snapshot.params.clinic_id;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CLINICS, () => {
      this.clinic = (this.store[STORE_SLICES.CLINICS] || {})[this.clinic_id];

      if (this.clinic_id && this.clinic === undefined) {
        this.clinic = this.getClinic(this.clinic_id);
      }
    });
  }

  public goToClinicDocuments(): void {
    this.goTo(
      [listDocumentsRoute()],
      {
        queryParams: { entity_type: EntityType.Clinic, entity_id: this.clinic_id },
      }
    );
  }

  public get shouldEnableEditButton(): boolean {
    return !!this.user.access[UserAccessFields.CreateClinic]
      || !!this.user.access[UserAccessFields.EditClinic]
      || this.user.profile.id === this.clinic.instructor_id;
  }

  public editClinic(): void {
    this.goTo([editClinicRoute(this.clinic_id)]);
  }

  public get shouldEnableEnrollButton(): boolean {
    return !(this.clinic.attendance || []).some(attendant => attendant.attendant_id === this.user.profile.id);
  }

  public enrollInClinic(): void {
    this.dispatchAction(enrollInClinic({ clinic_id: this.clinic_id, profile_id: this.user.profile.id, notify: true }));
  }

  public disenrollFromClinic(): void {
    this.dispatchAction(leaveClinic({ clinic_id: this.clinic_id, profile_id: this.user.profile.id, notify: true }));
  }

  public get shouldEnableDisenrollButton(): boolean {
    return (this.clinic.attendance || []).some(attendant => attendant.attendant_id === this.user.profile.id);
  }

  public removeUserFromClinic(profile_id: string): void {
    this.dispatchAction(removeUserFromClinic({ profile_id, clinic_id: this.clinic_id, notify: true }));
  }

  public graduateUserFromClinic(profile_id: string): void {
    this.dispatchAction(graduateUserFromClinic({ profile_id, clinic_id: this.clinic_id, notify: true }));
  }

  public get shouldEnableEditEnrollmentButton(): boolean {
    return !!this.user.access[UserAccessFields.EditClinic] || this.user.profile.id === this.clinic.instructor_id;
  }

  public get shouldEnableGraduateButton(): boolean {
    return this.clinic.instructor_id === this.user.profile.id;
    return true;
  }

  public get shouldEnableRemoveButton(): boolean {
    return !!this.user.access[UserAccessFields.EditClinic] || this.clinic.instructor_id === this.user.profile.id;
  }

}
