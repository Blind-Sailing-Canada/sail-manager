import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { debounceTime, filter, firstValueFrom, fromEvent, map, switchMap, takeWhile } from 'rxjs';
import { PaginatedSailRequest } from '../../../../../../api/src/types/sail-request/paginated-sail-request';
import { SailRequest } from '../../../../../../api/src/types/sail-request/sail-request';
import { SailRequestStatus } from '../../../../../../api/src/types/sail-request/sail-request-status';
import { SailCategoryState } from '../../../models/sail-category-state.interface';
import {
  createSailRequestRoute,
} from '../../../routes/routes';
import { SailRequestService } from '../../../services/sail-request.service';
import { fetchSailCategories } from '../../../store/actions/sail-category.actions';
import { STORE_SLICES } from '../../../store/store';
import { SailRequestBasePageComponent } from '../sail-request-base-page/sail-request-base-page.component';

@Component({
  selector: 'app-sail-request-list-page',
  templateUrl: './sail-request-list-page.component.html',
  styleUrls: ['./sail-request-list-page.component.css']
})
export class SailRequestListPageComponent extends SailRequestBasePageComponent implements OnInit, AfterViewInit {

  public dataSource = new MatTableDataSource<SailRequest>([]);
  public displayedColumns: string[] = ['entity_number', 'created_at', 'requested_by', 'category', 'status'];
  public filter: string;
  public paginatedData: PaginatedSailRequest;
  public profile_id: string;
  public requestStatus: SailRequestStatus | 'ANY' = SailRequestStatus.New;
  public requestCategory: string | 'ANY' = 'ANY';
  public requestCategoryValues: string[] = ['ANY'];
  public requestStatusValues = { ...SailRequestStatus, ANY: 'ANY' };
  public sort: string;
  public pagination: PageEvent = { pageIndex: 0, length: 0, pageSize: 20, previousPageIndex: 0 };

  @ViewChild('filterInput', { static: false }) private filterInput;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(SailRequestService) private sailRequestService: SailRequestService,
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
          return this.filterSailRequests();
        }),
      );

    typeAhead.subscribe();

    super.ngAfterViewInit();
  }

  public get createSailRequestRouteLink(): string {
    return createSailRequestRoute.toString();
  }

  public async filterSailRequests(): Promise<void> {
    const pagination = this.pagination;
    const query = { $and: [] };

    if (this.filter) {
      query.$and.push({ $or: [{ details: { $contL: this.filter } }, { 'requested_by.name': { $contL: this.filter } }] });
    }

    if (this.requestStatus !== 'ANY') {
      query.$and.push({ status: this.requestStatus });
    }

    if (this.requestCategory !== 'ANY') {
      query.$and.push({ category: this.requestCategory });
    }

    this.startLoading();

    const mediaFetch =  this.sailRequestService.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, this.sort);
    this.paginatedData = await firstValueFrom(mediaFetch).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} requests on page #${page.page}.`);
  }

  public paginationHandler(event: PageEvent) {
    this.pagination = event;
    this.filterSailRequests();
  }

  public sortHandler(event: Sort) {
    if (event.direction) {
      this.sort = `${event.active},${event.direction.toUpperCase()}`;
    } else {
      this.sort = '';
    }

    this.filterSailRequests();
  }
}
