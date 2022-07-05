import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
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
import { updateBoatMaintenance } from '../../../store/actions/boat-maintenance.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-maintenance-resolve-page',
  templateUrl: './maintenance-resolve-page.component.html',
  styleUrls: ['./maintenance-resolve-page.component.css']
})
export class MaintenanceResolvePageComponent extends BasePageComponent implements OnInit {

  public maintenanceResolveForm: UntypedFormGroup;
  public boat_maintenance_id: string;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(UntypedFormBuilder) private fb: UntypedFormBuilder,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    this.boat_maintenance_id = this.route.snapshot.params.id;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);

    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOAT_MAINTENANCES, () => {
      if (!this.maintenance) {
        return;
      }

      if (!this.maintenanceResolveForm) {
        this.buildForm();
      } else {
        this.updateForm();
      }
    });

    if (!this.maintenance) {
      this.fetchBoatMaintenance(this.boat_maintenance_id);
    }

  }

  public get maintenance(): BoatMaintenance {
    return this.maintenances[this.boat_maintenance_id];
  }

  public get shouldEnableSubmit(): boolean {
    if (!this.maintenanceResolveForm) {
      return false;
    }

    return this.maintenanceResolveForm.dirty && this.maintenanceResolveForm.valid;
  }

  public submitMaintenanceResolveForm(): void {
    const maintenance: Partial<BoatMaintenance> = {
      service_details: this.maintenanceResolveForm.controls.service_details.value.trim(),
      resolution_details: this.maintenanceResolveForm.controls.service_details.value.trim(),
      serviced_at: new Date(),
      resolved_by_id: this.user.profile.id,
      status: BoatMaintenanceStatus.Resolved,
    };

    this.dispatchAction(updateBoatMaintenance({ maintenance, boat_maintenance_id: this.boat_maintenance_id, notify: true }));
  }

  private buildForm(): void {
    this.maintenanceResolveForm = this.fb.group({
      service_details: this.fb.control(this.maintenance.service_details, Validators.required),
    });
  }

  private updateForm(): void {
    this.maintenanceResolveForm.controls.service_details.patchValue(this.maintenance.service_details);
    this.maintenanceResolveForm.updateValueAndValidity();
    this.maintenanceResolveForm.markAsPristine();
  }

}
