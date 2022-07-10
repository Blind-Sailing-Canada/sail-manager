import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
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
import { DEFAULT_PAGINATION } from '../../../models/default-pagination';
import { debounceTime, filter, firstValueFrom, fromEvent, map, switchMap, takeWhile } from 'rxjs';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { BoatMaintenanceService } from '../../../services/boat-maintenance.service';

@Component({
  selector: 'app-maintenance-list-page',
  templateUrl: './maintenance-list-page.component.html',
  styleUrls: ['./maintenance-list-page.component.css']
})
export class MaintenanceListPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
  public boat_id: string;
  public dataSource = new MatTableDataSource<BoatMaintenance>([]);
  public displayedColumns: string[] = ['request_details', 'boat', 'created_at', 'status', 'action'];
  public filter: string;
  public maintenanceStatus: BoatMaintenanceStatus | 'ANY' = BoatMaintenanceStatus.New;
  public maintenanceStatusValues = { ...BoatMaintenanceStatus, ANY: 'ANY' };
  public paginatedData: PaginatedMaintenance;
  public pagination = DEFAULT_PAGINATION;
  public sort: string;

  @ViewChild('filterInput', { static: false }) private filterInput;

  constructor(
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(Store) store: Store<any>,
    @Inject(BoatMaintenanceService) private maintenanceService: BoatMaintenanceService,
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

  ngAfterViewInit(): void {
    const typeAhead = fromEvent(this.filterInput.nativeElement, 'input')
      .pipe(
        takeWhile(() => this.active),
        map((e: any) => (e.target.value || '') as string),
        debounceTime(1000),
        map(text => text ? text.trim() : ''),
        filter(text => text.length === 0 || text.length > 2),
        switchMap((text) => {
          this.filter = text;
          return this.filterMaintenances();
        }),
      );

    typeAhead.subscribe();

    super.ngAfterViewInit();
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
    const pagination = this.pagination;
    const query = { $and: [] };

    if (this.filter) {
      query.$and.push({ $or: [
        { 'boat.name': { $contL: this.filter } },
        { 'comments.comment': { $contL: this.filter } },
        { 'requested_by.name': { $contL: this.filter } },
        { 'requested_by.name': { $contL: this.filter } },
        { request_details: { $contL: this.filter } },
        { resolution_details: { $contL: this.filter } },
        { service_details: { $contL: this.filter } },
      ] });
    }

    if (this.maintenanceStatus !== 'ANY') {
      query.$and.push({ status: this.maintenanceStatus });
    }

    if(this.boat_id) {
      query.$and.push({ boat_id: this.boat_id });
    }

    this.startLoading();

    const mediaFetch =  this.maintenanceService.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, this.sort);
    this.paginatedData = await firstValueFrom(mediaFetch).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} requests on page #${page.page}.`);
  }

  public paginationHandler(event: PageEvent) {
    this.pagination = event;
    this.filterMaintenances();
  }

  public sortHandler(event: Sort) {
    if (event.direction) {
      this.sort = `${event.active},${event.direction.toUpperCase()}`;
    } else {
      this.sort = '';
    }

    this.filterMaintenances();
  }

}
