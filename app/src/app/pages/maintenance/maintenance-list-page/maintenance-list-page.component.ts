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
import { BoatMaintenance } from '../../../../../../api/src/types/boat-maintenance/boat-maintenance';
import { BoatMaintenanceStatus } from '../../../../../../api/src/types/boat-maintenance/boat-maintenance-status';
import {
  createMaintenanceRoute,
  viewMaintenanceRoute,
} from '../../../routes/routes';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-maintenance-list-page',
  templateUrl: './maintenance-list-page.component.html',
  styleUrls: ['./maintenance-list-page.component.css']
})
export class MaintenanceListPageComponent extends BasePageComponent implements OnInit {
  public boat_id: string;

  constructor(
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(Store) store: Store<any>
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    this.boat_id = this.route.snapshot.queryParams.boat_id;
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOAT_MAINTENANCES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.LOGIN, () => {
      if (this.user) {
        this.fetchRecentNewRequests(this.boat_id);
        this.fetchRecentResolvedRequests(this.boat_id);
        this.fetchRecentInProgressRequests(this.boat_id);
      }
    });
  }

  public get boatName(): string {
    if (!this.boat_id) {
      return '';
    }

    return this.getBoat(this.boat_id).name;
  }
  public fetchRecentNewRequests(boat_id: string, notify: boolean = false): void {
    if (boat_id) {
      this.fetchBoatMaintenances(`filter=boat_id||$eq||${boat_id}&filter=status||$eq||${BoatMaintenanceStatus.New}&limit=10`, notify);
    } else {
      this.fetchBoatMaintenances(`filter=status||$eq||${BoatMaintenanceStatus.New}&limit=10`, notify);
    }
  }

  public fetchRecentResolvedRequests(boat_id: string, notify: boolean = false): void {
    if (boat_id) {
      this.fetchBoatMaintenances(
        `filter=boat_id||$eq||${boat_id}&filter=status||$eq||${BoatMaintenanceStatus.Resolved}&limit=10&sort=serviced_at,DESC`, notify);
    } else {
      this.fetchBoatMaintenances(
        `filter=status||$eq||${BoatMaintenanceStatus.Resolved}&limit=10&sort=serviced_at,DESC`, notify);
    }
  }

  public fetchRecentInProgressRequests(boat_id: string, notify: boolean = false): void {
    if (boat_id) {
      this
      .fetchBoatMaintenances(`filter=boat_id||$eq||${boat_id}&filter=status||$eq||${BoatMaintenanceStatus.InProgress}&limit=10`, notify);
    } else {
      this.fetchBoatMaintenances(`filter=status||$eq||${BoatMaintenanceStatus.InProgress}&limit=10`, notify);
    }
  }

  private filterAndSort(requests: BoatMaintenance[], status: BoatMaintenanceStatus, boat_id?: string): BoatMaintenance[] {
    return requests
      .filter(request => request.status === status)
      .filter(request => boat_id ? request.boat_id === boat_id : true)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  }
  public get newRequests(): BoatMaintenance[] {
    return this.filterAndSort(this.maintenancesArray, BoatMaintenanceStatus.New, this.boat_id);
  }

  public get resolvedRequests(): BoatMaintenance[] {
    return this.filterAndSort(this.maintenancesArray, BoatMaintenanceStatus.Resolved, this.boat_id);
  }

  public get inProgressRequests(): BoatMaintenance[] {
    return this.filterAndSort(this.maintenancesArray, BoatMaintenanceStatus.InProgress, this.boat_id);
  }

  public goToViewMaintenance(request: BoatMaintenance): void {
    this.goTo([viewMaintenanceRoute(request.id)]);
  }

  public goToCreateNewMaintenance(): void {
    if (this.boat_id) {
      this.goTo([createMaintenanceRoute], { queryParams: { boat_id: this.boat_id } });
    } else {
      this.goTo([createMaintenanceRoute]);
    }
  }
}
