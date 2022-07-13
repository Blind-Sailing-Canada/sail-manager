import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { BoatMaintenance } from '../../../../../../api/src/types/boat-maintenance/boat-maintenance';
import { BoatMaintenanceStatus } from '../../../../../../api/src/types/boat-maintenance/boat-maintenance-status';
import { Boat } from '../../../../../../api/src/types/boat/boat';
import { viewMaintenanceRoute } from '../../../routes/routes';
import {
  createBoatMaintenance,
  updateBoatMaintenance,
} from '../../../store/actions/boat-maintenance.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-maintenance-edit-page',
  templateUrl: './maintenance-edit-page.component.html',
  styleUrls: ['./maintenance-edit-page.component.scss']
})
export class MaintenanceEditPageComponent extends BasePageComponent implements OnInit {

  public boat_maintenance_id: string;
  public creatingNewMaintenance: boolean;
  public maintenanceForm: UntypedFormGroup;
  public maintenanceStatus = BoatMaintenanceStatus;
  public readonly maintenancePictureInputId = 'maintenancePictureInput';
  public totalFormSteps = 4;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(UntypedFormBuilder) private fb: UntypedFormBuilder,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    const boat_id = this.route.snapshot.queryParams.boat_id;

    this.boat_maintenance_id = this.route.snapshot.params.id;
    this.creatingNewMaintenance = !this.boat_maintenance_id;
    this.totalFormSteps = this.creatingNewMaintenance ? 3 : 4;

    this.buildForm(boat_id);

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.LOGIN, () => {
      if (this.user) {
        this.fetchBoats(false);
      }
    });
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS, () => {
      if (!this.maintenanceForm) {
        return;
      }
      if (!this.maintenanceForm.controls.boat_id.value || this.maintenanceForm.controls.boat_id.value === 'null') {
        this.maintenanceForm.patchValue({ boat_id: boat_id || (this.boatsArray[0] || {}).id });
      }
    });
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOAT_MAINTENANCES, () => {
      const request = this.maintenance;
      if (request) {
        this.updateForm();
      }
    });
  }

  public goToViewMaintenance(): void {
    this.goTo([viewMaintenanceRoute(this.boat_maintenance_id)]);
  }

  public get isServiceDetailsRequired(): boolean {
    return this.maintenanceForm.controls.status.value === BoatMaintenanceStatus.Resolved;
  }

  protected get pictureControls(): AbstractControl[] {
    if (!this.maintenanceForm) {
      return [];
    }

    return (this.maintenanceForm.controls.pictures as UntypedFormArray).controls;
  }

  protected get maintenance(): BoatMaintenance {
    if (!this.boat_maintenance_id) {
      return;
    }
    const request = this.maintenances[this.boat_maintenance_id];
    if (!request && request !== null) {
      this.fetchBoatMaintenance(this.boat_maintenance_id, false);
    }

    return request;
  }

  public get shouldEnableSubmitButton(): boolean {
    return this.maintenanceForm && this.maintenanceForm.valid && this.maintenanceForm.dirty;
  }

  public formErrors(controlName: string): string[] {
    const errors = Object.keys(this.maintenanceForm.controls[controlName].errors || {});
    return errors;
  }

  public get title(): string {
    return this.creatingNewMaintenance ? 'New Maintenance Request Form' : 'Edit Maintenance Request Form';
  }

  public submitForm(): void {
    if (this.creatingNewMaintenance) {
      const maintenanceData: BoatMaintenance = this.maintenanceForm.getRawValue();
      maintenanceData.created_at = new Date();
      maintenanceData.requested_by_id = this.user.profile.id;
      maintenanceData.status = BoatMaintenanceStatus.New;
      this.dispatchAction(createBoatMaintenance({ maintenance: maintenanceData, notify: true }));
    } else {
      const changedValues: BoatMaintenance = Object
        .keys(this.maintenanceForm.controls)
        .filter(controlName => !this.maintenanceForm.controls[controlName].pristine)
        .reduce(
          (red, controlName) => {
            red[controlName] = this.maintenanceForm.controls[controlName].value;
            return red;
          },
          {}) as BoatMaintenance;
      this.dispatchAction(
        updateBoatMaintenance({ boat_maintenance_id: this.boat_maintenance_id, maintenance: changedValues, notify: true }));
    }
  }

  public compareBoats(a: Boat, b: Boat): boolean {
    return a.id === b.id;
  }

  private updateForm(): void {
    const request = this.maintenance;
    this.maintenanceForm.patchValue(request);

    const pictures = (this.maintenanceForm.controls.pictures as UntypedFormArray);

    while (pictures?.length) {
      pictures.removeAt(0);
    }

    request.pictures.forEach((pic) => {
      pictures.push(this.fb.group(pic));
    });

    this.maintenanceForm.markAsUntouched();
    this.maintenanceForm.markAsPristine();
  }

  private buildForm(boat_id?: string): void {
    this.maintenanceForm = this.fb.group({
      boat_id: this.fb.control(boat_id, Validators.required),
      request_details: this.fb.control(undefined, Validators.required),
      status: this.fb.control({ value: BoatMaintenanceStatus.New, disabled: !this.boat_maintenance_id }),
      service_details: this.fb.control({ value: undefined, disabled: !this.boat_maintenance_id }),
    });
  }
}
