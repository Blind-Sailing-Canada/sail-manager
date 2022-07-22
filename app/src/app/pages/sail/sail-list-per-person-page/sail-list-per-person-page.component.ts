import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';

import { createSailRequestRoute, sailRequestsRoute, viewSailRoute } from '../../../routes/routes';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { Sail } from '../../../../../../api/src/types/sail/sail';
import { Profile } from '../../../../../../api/src/types/profile/profile';
import { MatTableDataSource } from '@angular/material/table';
import { FilterInfo } from '../../../models/filter-into';
import { DEFAULT_PAGINATION } from '../../../models/default-pagination';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PaginatedSail } from '../../../../../../api/src/types/sail/paginated-sail';
import { SailStatus } from '../../../../../../api/src/types/sail/sail-status';
import { UserSailsService } from '../../../services/user-sails.service';
import { WindowService } from '../../../services/window.service';
import { Boat } from '../../../../../../api/src/types/boat/boat';

@Component({
  selector: 'app-sail-list-per-person-page',
  templateUrl: './sail-list-per-person-page.component.html',
  styleUrls: ['./sail-list-per-person-page.component.scss']
})
export class SailListPerPersonPageComponent extends BasePageComponent implements OnInit {

  public createSailRequestRoute = createSailRequestRoute.toString();
  public dataSource = new MatTableDataSource<Sail>([]);
  public displayedColumns: string[] = ['entity_number', 'name', 'start_at', 'boat.name', 'status', 'action'];
  public displayedColumnsMobile: string[] = ['entity_number'];
  public filterInfo: FilterInfo = { search: '', pagination: DEFAULT_PAGINATION, sort: 'start_at,DESC' };
  public listSailRequestRoute = sailRequestsRoute.toString();
  public paginatedData: PaginatedSail;
  public profile: Profile;
  public profile_id: string;
  public sailStatus: SailStatus | 'ANY' = 'ANY';
  public sailStatusValues = { ...SailStatus, ANY: 'ANY' };

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(UserSailsService) private userSailsService: UserSailsService,
    @Inject(WindowService) public windowService: WindowService,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    this.profile_id = this.route.snapshot.params.profile_id;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES, () => {
      this.profile = this.getProfile(this.profile_id);
    });

    this.filterSails();
  }

  public boatThumbnail(boat: Boat): string {
    if (!boat?.pictures?.length) {
      return '/assets/icons/sailing_black_48dp.svg';
    }
    return `${boat.pictures[0]}?width=200`;
  }

  public async filterSails() {
    const { search, sort, pagination } = this.filterInfo;

    const query = { $and: [] };

    if (search) {
      query.$and.push({ $or: [
        { 'boat.name': { $contL: search } },
        { category: { $contL: search } },
        { description: { $contL: search } },
        { name: { $contL: search } },
      ] });
    }

    if (this.sailStatus !== 'ANY') {
      query.$and.push({ status: this.sailStatus });
    }

    query.$and.push({ 'manifest.profile_id': this.profile_id });
    this.startLoading();

    const fetcher =  this.userSailsService.fetchUserSailsPaginated(query, pagination.pageIndex + 1, pagination.pageSize, sort);
    this.paginatedData = await firstValueFrom(fetcher).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} sails on page #${page.page}.`);
  }

  public goToSail(sail: Sail): void {
    this.goTo([viewSailRoute(sail.id)]);
  }

  public statusHandler(): void {
    this.filterInfo.pagination.pageIndex = 0;

    this.filterSails();
  }

  public filterHandler(event: FilterInfo): void {
    this.filterInfo = event;

    this.filterSails();
  }
}
