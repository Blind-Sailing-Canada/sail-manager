import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
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
import { firstValueFrom } from 'rxjs';
import { PaginatedSail } from '../../../../../../api/src/types/sail/paginated-sail';
import { Sail } from '../../../../../../api/src/types/sail/sail';
import { MatTableDataSource } from '@angular/material/table';
import { FilterInfo } from '../../../models/filter-into';
import { DEFAULT_PAGINATION } from '../../../models/default-pagination';
import { Boat } from '../../../../../../api/src/types/boat/boat';
import { WindowService } from '../../../services/window.service';
import { putSails } from '../../../store/actions/sail.actions';
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
  public filterInfo: FilterInfo = { search: '', pagination: DEFAULT_PAGINATION, sort: 'start_at,DESC' };
  public paginatedData: PaginatedSail;
  public sailEnd: string;
  public sailName: string;
  public sailStart: string;
  public sailStatus: SailStatus | 'ANY' = 'ANY';
  public sailStatusValues = { ...SailStatus, ANY: 'ANY' };
  public sailorName: string;

  constructor(
    @Inject(Router) router: Router,
    @Inject(Store) store: Store<any>,
    @Inject(SailService) private sailService: SailService,
    @Inject(WindowService) public windowService: WindowService,
    @Inject(MatDialog) dialog: MatDialog,
  ) {
    super(store, undefined, router, dialog);
  }

  ngOnInit() {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS);

    const sailSearchData = JSON.parse(sessionStorage.getItem('sailSearchData') || '{}');
    this.boatName = sailSearchData.boatName;
    this.sailEnd = sailSearchData.sailEnd;
    this.sailName = sailSearchData.sailName;
    this.sailStart = sailSearchData.sailStart;
    this.sailStatus = sailSearchData.sailStatus || 'ANY';
    this.sailorName = sailSearchData.sailorName;

    this.fetchSails();
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

  public get canDownload(): boolean {
    return this.user?.access[UserAccessFields.DownloadSails];
  }

  public download(): void {
    const query = this.buildQuery();

    this.sailService
      .download(query)
      .subscribe(
        (data: any) => {
          const blob = new Blob([data], { type: 'text/csv' });
          const date = new Date();

          const fileName = `sails-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.csv`;

          const link = document.createElement('a');

          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        },
        error => console.error('download error', error),
      );
  }

  public applyFilter(): void {
    this.filterInfo = {
      ...this.filterInfo,
      pagination: DEFAULT_PAGINATION
    };

    this.fetchSails();
  }

  public async fetchSails() {
    const query = this.buildQuery();

    this.startLoading();

    const fetcher = this.sailService.searchPaginated(query);
    this.paginatedData = await firstValueFrom(fetcher).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchAction(putSails({ sails: this.paginatedData.data }));
    this.dispatchMessage(`Displaying ${page.count} of ${page.total} sails on page #${page.page}.`);
  }

  private buildQuery() {
    sessionStorage.setItem('sailSearchData', JSON.stringify({
      boatName: this.boatName,
      sailEnd: this.sailEnd,
      sailName: this.sailName,
      sailStart: this.sailStart,
      sailStatus: this.sailStatus,
      sailorName: this.sailorName,
    }));

    const query = {} as any;

    if (this.sailName) {
      query.sailName = this.sailName;
    }

    if (this.sailStart) {
      query.sailStart = new Date(`${this.sailStart}T00:00:00`).toISOString();
    }

    if (this.sailEnd) {
      query.sailEnd = new Date(`${this.sailEnd}T23:59:59`).toISOString();
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

    this.fetchSails();
  }

  public boatThumbnail(boat: Boat): string {
    if (!boat?.pictures?.length) {
      return '/assets/icons/sailing_black_48dp.svg';
    }
    return `${boat.pictures[0]}?width=200`;
  }

}
