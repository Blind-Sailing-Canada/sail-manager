import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import {
  createSailRoute,
  sailChecklistsRoute,
  sailRequestsRoute,
} from '../../../routes/routes';
import { BasePageComponent } from '../../base-page/base-page.component';
import { Access } from '../../../../../../api/src/types/user-access/access';
import { SailStatus } from '../../../../../../api/src/types/sail/sail-status';
import { ProfileRole } from '../../../../../../api/src/types/profile/profile-role';
import { SailService } from '../../../services/sail.service';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';
import { STORE_SLICES } from '../../../store/store';
import { firstValueFrom, takeWhile } from 'rxjs';
import { PaginatedSail } from '../../../../../../api/src/types/sail/paginated-sail';
import { Sail } from '../../../../../../api/src/types/sail/sail';
import { MatTableDataSource } from '@angular/material/table';
import { FilterInfo } from '../../../models/filter-into';
import { DEFAULT_PAGINATION } from '../../../models/default-pagination';
import { Boat } from '../../../../../../api/src/types/boat/boat';
import { WindowService } from '../../../services/window.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-sail-list-page',
  styleUrls: ['./sail-list-page.component.scss'],
  templateUrl: './sail-list-page.component.html',
})
export class SailListPageComponent extends BasePageComponent implements OnInit {
  public CREATE_SAIL_ROUTE = createSailRoute.toString();
  public VIEW_SAIL_CHECKLISTS_ROUTE = sailChecklistsRoute.toString();
  public VIEW_SAIL_REQUESTS_ROUTE = sailRequestsRoute.toString();
  public boatName: string;
  public dataSource = new MatTableDataSource<Sail>([]);
  public displayedColumns: string[] = ['entity_number', 'name', 'start_at', 'boat.name', 'status', 'action'];
  public displayedColumnsMobile: string[] = ['entity_number'];
  public filterInfo: FilterInfo = { search: '', pagination: { ...DEFAULT_PAGINATION }, sort: 'start_at,DESC' };
  public paginatedData: PaginatedSail;
  public sailEnd: string;
  public sailName: string;
  public sailStart: string;
  public sailStatus: SailStatus | 'ANY' = 'ANY';
  public sailStatusValues = { ...SailStatus, ANY: 'ANY' };
  public sailorName: string;

  constructor(
    @Inject(Router) router: Router,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Store) store: Store<any>,
    @Inject(SailService) private sailService: SailService,
    @Inject(WindowService) public windowService: WindowService,
    @Inject(MatDialog) dialog: MatDialog,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    this.route.queryParams
      .pipe(takeWhile(() => this.active && !!this.user))
      .subscribe((params) => {
        if (params.page === undefined) {
          return;
        }
        this.updateFilter(params);
        this.fetchSails();
      });
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS);

    this.updateFilter(this.route.snapshot.queryParams);
    this.updateSailsUrl();
  }

  private updateFilter(params) {
    this.boatName = params.boatName;
    this.sailEnd = params.sailEnd?.split('T')[0];
    this.sailName = params.sailName;
    this.sailStart = params.sailStart?.split('T')[0];
    this.sailStatus = params.sailStatus || 'ANY';
    this.sailorName = params.sailorName;
    this.filterInfo.pagination.pageIndex = (params.page ?? 1) - 1;
    this.filterInfo.pagination.pageSize = params.per_page ?? DEFAULT_PAGINATION.pageSize;
    this.filterInfo.sort = params.sort ?? 'start_at,DESC';
  }

  public resetFilter() {
    this.boatName = null;
    this.sailEnd = null;
    this.sailName = null;
    this.sailStart = null;
    this.sailStatus = 'ANY';
    this.sailorName = null;
  }

  public goToViewSail(id: string): void {
    this.viewSail(id);
  }

  public applyFilter(): void {
    this.filterInfo = {
      ...this.filterInfo,
      pagination: { ...DEFAULT_PAGINATION }
    };

    this.updateSailsUrl();
  }

  private updateSailsUrl() {
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: this.buildQuery(),
        queryParamsHandling: 'merge',
        replaceUrl: this.route.snapshot.queryParams.page === undefined,
      });
  }

  private async fetchSails() {
    const query = this.buildQuery();

    this.startLoading();

    const fetcher = this.sailService.searchPaginated(query);
    this.paginatedData = await firstValueFrom(fetcher).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} sails on page #${page.page}.`);
  }

  private buildQuery() {
    const query = {} as any;

    if (this.sailName) {
      query.sailName = this.sailName;
    }

    if (this.sailStart) {
      query.sailStart = new Date(`${this.sailStart}T00:00:00Z`).toISOString();
    }

    if (this.sailEnd) {
      query.sailEnd = new Date(`${this.sailEnd}T23:59:59Z`).toISOString();
    }

    if (this.boatName) {
      query.boatName = this.boatName;
    }

    if (this.sailorName) {
      query.sailorNames = this.sailorName.split(',').map(name => name.trim());
    }

    if (this.sailStatus && this.sailStatus !== 'ANY') {
      query.sailStatus = this.sailStatus;
    }

    query.sort = this.filterInfo.sort;
    query.page = this.filterInfo.pagination.pageIndex + 1;
    query.per_page = this.filterInfo.pagination.pageSize;

    return query;
  }

  public get shouldShowControls(): boolean {
    const user = this.user;

    if (!user) {
      return false;
    }

    const roles: string[] = user.roles || [];
    const access: Access = user.access || {};

    const should = access[UserAccessFields.CreateSail] ||
      roles.some(role => role === ProfileRole.Admin || role === ProfileRole.Coordinator);

    return should;
  }

  public filterHandler(event: FilterInfo): void {
    this.filterInfo = event;

    this.updateSailsUrl();
  }

  public boatThumbnail(boat: Boat): string {
    if (!boat?.pictures?.length) {
      return '/assets/icons/sailing_black_48dp.svg';
    }
    return `${boat.pictures[0]}?width=200`;
  }

}
