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
  public boatId: string;

  constructor(
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(Store) store: Store<any>
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    this.boatId = this.route.snapshot.queryParams.boatId;
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOAT_MAINTENANCES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.LOGIN, () => {
      if (this.user) {
        this.fetchRecentNewRequests(this.boatId);
        this.fetchRecentResolvedRequests(this.boatId);
        this.fetchRecentInProgressRequests(this.boatId);
      }
    });
  }

  public get boatName(): string {
    if (!this.boatId) {
      return '';
    }

    return this.getBoat(this.boatId).name;
  }
  public fetchRecentNewRequests(boatId: string, notify: boolean = false): void {
    if (boatId) {
      this.fetchBoatMaintenances(`filter=boatId||$eq||${boatId}&filter=status||$eq||${BoatMaintenanceStatus.New}&limit=10`, notify);
    } else {
      this.fetchBoatMaintenances(`filter=status||$eq||${BoatMaintenanceStatus.New}&limit=10`, notify);
    }
  }

  public fetchRecentResolvedRequests(boatId: string, notify: boolean = false): void {
    if (boatId) {
      this.fetchBoatMaintenances(
        `filter=boatId||$eq||${boatId}&filter=status||$eq||${BoatMaintenanceStatus.Resolved}&limit=10&sort=servicedAt,DESC`, notify);
    } else {
      this.fetchBoatMaintenances(
        `filter=status||$eq||${BoatMaintenanceStatus.Resolved}&limit=10&sort=servicedAt,DESC`, notify);
    }
  }

  public fetchRecentInProgressRequests(boatId: string, notify: boolean = false): void {
    if (boatId) {
      this.fetchBoatMaintenances(`filter=boatId||$eq||${boatId}&filter=status||$eq||${BoatMaintenanceStatus.InProgress}&limit=10`, notify);
    } else {
      this.fetchBoatMaintenances(`filter=status||$eq||${BoatMaintenanceStatus.InProgress}&limit=10`, notify);
    }
  }

  private filterAndSort(requests: BoatMaintenance[], status: BoatMaintenanceStatus, boatId?: string): BoatMaintenance[] {
    return requests
      .filter(request => request.status === status)
      .filter(request => boatId ? request.boatId === boatId : true)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  }
  public get newRequests(): BoatMaintenance[] {
    return this.filterAndSort(this.maintenancesArray, BoatMaintenanceStatus.New, this.boatId);
  }

  public get resolvedRequests(): BoatMaintenance[] {
    return this.filterAndSort(this.maintenancesArray, BoatMaintenanceStatus.Resolved, this.boatId);
  }

  public get inProgressRequests(): BoatMaintenance[] {
    return this.filterAndSort(this.maintenancesArray, BoatMaintenanceStatus.InProgress, this.boatId);
  }

  public goToViewMaintenance(request: BoatMaintenance): void {
    this.goTo([viewMaintenanceRoute(request.id)]);
  }

  public goToCreateNewMaintenance(): void {
    if (this.boatId) {
      this.goTo([createMaintenanceRoute], { queryParams: { boatId: this.boatId } });
    } else {
      this.goTo([createMaintenanceRoute]);
    }
  }
}
