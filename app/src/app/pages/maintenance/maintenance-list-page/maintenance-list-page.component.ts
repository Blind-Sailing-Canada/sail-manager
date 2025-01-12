import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
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
import { PaginatedMaintenance } from '../../../../../../api/src/types/boat-maintenance/paginated-maintenance';
import { firstValueFrom } from 'rxjs';
import { BoatMaintenanceService } from '../../../services/boat-maintenance.service';
import { WindowService } from '../../../services/window.service';
import { FilterInfo } from '../../../models/filter-into';
import { DEFAULT_PAGINATION } from '../../../models/default-pagination';

@Component({
  selector: 'app-maintenance-list-page',
  templateUrl: './maintenance-list-page.component.html',
  styleUrls: ['./maintenance-list-page.component.scss']
})
export class MaintenanceListPageComponent extends BasePageComponent implements OnInit {
  public boat_id: string;
  public dataSource = new MatTableDataSource<BoatMaintenance>([]);
  public displayedColumns: string[] = ['request_details', 'boat.name', 'created_at', 'status', 'action'];
  public displayedColumnsMobile: string[] = ['request_details'];
  public filterInfo: FilterInfo = { search: '', pagination: { ...DEFAULT_PAGINATION }, sort: 'created_at,DESC' };
  public maintenanceStatus: BoatMaintenanceStatus[] = [BoatMaintenanceStatus.New, BoatMaintenanceStatus.InProgress];
  public maintenanceStatusValues = BoatMaintenanceStatus;
  public paginatedData: PaginatedMaintenance;

  constructor(
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(Store) store: Store<any>,
    @Inject(BoatMaintenanceService) private maintenanceService: BoatMaintenanceService,
    @Inject(WindowService) public windowService: WindowService,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    this.boat_id = this.route.snapshot.queryParams.boat_id;
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOAT_MAINTENANCES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.LOGIN);

    this.filterMaintenances();
  }

  public get boatName(): string {
    if (!this.boat_id) {
      return '';
    }

    return this.getBoat(this.boat_id)?.name;
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

  public async filterMaintenances(): Promise<void> {
    const { search, sort, pagination } = this.filterInfo;

    const query = { $and: [] };

    if (search) {
      query.$and.push({
        $or: [
          { 'boat.name': { $contL: search } },
          { 'comments.comment': { $contL: search } },
          { 'requested_by.name': { $contL: search } },
          { 'requested_by.name': { $contL: search } },
          { request_details: { $contL: search } },
          { resolution_details: { $contL: search } },
          { service_details: { $contL: search } },
        ]
      });
    }

    if (this.maintenanceStatus.length) {
      query.$and.push({ status: { $in: this.maintenanceStatus } });
    }

    if (this.boat_id) {
      query.$and.push({ boat_id: this.boat_id });
    }

    this.startLoading();

    const fetcher = this.maintenanceService.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, sort);
    this.paginatedData = await firstValueFrom(fetcher).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} requests on page #${page.page}.`);
  }

  public filterHandler(event: FilterInfo): void {
    this.filterInfo = event;

    this.filterMaintenances();
  }

}
