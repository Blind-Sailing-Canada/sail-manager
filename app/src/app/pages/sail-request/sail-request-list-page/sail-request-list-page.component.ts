import {
  AfterViewInit,
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
import { firstValueFrom } from 'rxjs';
import { PaginatedSailRequest } from '../../../../../../api/src/types/sail-request/paginated-sail-request';
import { SailRequest } from '../../../../../../api/src/types/sail-request/sail-request';
import { SailRequestStatus } from '../../../../../../api/src/types/sail-request/sail-request-status';
import { DEFAULT_PAGINATION } from '../../../models/default-pagination';
import { FilterInfo } from '../../../models/filter-into';
import { SailCategoryState } from '../../../models/sail-category-state.interface';
import {
  createSailRequestRoute,
} from '../../../routes/routes';
import { SailRequestService } from '../../../services/sail-request.service';
import { WindowService } from '../../../services/window.service';
import { fetchSailCategories } from '../../../store/actions/sail-category.actions';
import { STORE_SLICES } from '../../../store/store';
import { SailRequestBasePageComponent } from '../sail-request-base-page/sail-request-base-page.component';

@Component({
  selector: 'app-sail-request-list-page',
  templateUrl: './sail-request-list-page.component.html',
  styleUrls: ['./sail-request-list-page.component.scss']
})
export class SailRequestListPageComponent extends SailRequestBasePageComponent implements OnInit, AfterViewInit {

  public dataSource = new MatTableDataSource<SailRequest>([]);
  public displayedColumns: string[] = ['entity_number', 'details', 'requested_by', 'category', 'created_at', 'status', 'actions'];
  public displayedColumnsMobile: string[] = ['entity_number'];
  public filterInfo: FilterInfo = { search: '', pagination: DEFAULT_PAGINATION, sort: 'created_at,ASC' };
  public paginatedData: PaginatedSailRequest;
  public profile_id: string;
  public requestCategory: string | 'ANY' = 'ANY';
  public requestCategoryValues: string[] = ['ANY'];
  public requestStatus: SailRequestStatus | 'ANY' = SailRequestStatus.New;
  public requestStatusValues = { ...SailRequestStatus, ANY: 'ANY' };

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(SailRequestService) private sailRequestService: SailRequestService,
    @Inject(WindowService) public windowService: WindowService,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    super.ngOnInit();

    this.dispatchAction(fetchSailCategories({ notify: false }));

    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAIL_CATEGORIES, (categories: SailCategoryState) => {
      this.requestCategoryValues = Object.values(categories || {}).map(category => category.category);
      this.requestCategoryValues.unshift('ANY');
    });

    this.profile_id = this.route.snapshot.queryParams.profile_id;
    this.filterSailRequests();
  }

  public get createSailRequestRouteLink(): string {
    return createSailRequestRoute.toString();
  }

  public async filterSailRequests(): Promise<void> {
    const { search, sort, pagination } = this.filterInfo;

    const query = { $and: [] };

    if (search) {
      query.$and.push({ $or: [
        { details: { $contL: search } },
        { 'requested_by.name': { $contL: search } },
        { 'interest.profile.name': { $contL: search } },
      ] });
    }

    if (this.requestStatus !== 'ANY') {
      query.$and.push({ status: this.requestStatus });
    }

    if (this.requestCategory !== 'ANY') {
      query.$and.push({ category: this.requestCategory });
    }

    if (this.profile_id) {
      query.$and.push({ requested_by_id: this.profile_id });
    }

    this.startLoading();

    const fetcher =  this.sailRequestService.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, sort);
    this.paginatedData = await firstValueFrom(fetcher).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} requests on page #${page.page}.`);
  }

  public filterHandler(event: FilterInfo): void {
    this.filterInfo = event;

    this.filterSailRequests();
  }
}
