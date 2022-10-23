import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { DEFAULT_PAGINATION } from '../../../../models/default-pagination';
import { FilterInfo } from '../../../../models/filter-into';
import { SaveQueryService } from '../../../../services/saved-query.service';
import { BasePageComponent } from '../../../base-page/base-page.component';
import { PaginatedSavedQuery } from '../../../../../../../api/src/types/saved-query/paginated-saved-query';
import { firstValueFrom } from 'rxjs';
import { createSavedQueryRoute } from '../../../../routes/routes';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-saved-query-list-page',
  templateUrl: './saved-query-list-page.component.html',
  styleUrls: ['./saved-query-list-page.component.scss']
})
export class SavedQueryListPageComponent extends BasePageComponent implements OnInit {
  public filterInfo: FilterInfo = { search: '', pagination: DEFAULT_PAGINATION, sort: 'created_at,DESC' };
  public displayedColumns: string[] = ['name', 'created_at', 'created_by', 'action'];
  public paginatedData: PaginatedSavedQuery;
  public dataSource = new MatTableDataSource([]);
  public createSavedQueryRoute = createSavedQueryRoute.toString();

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(SaveQueryService) private savedQueryService: SaveQueryService,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router) {
    super(store, route, router);
  }

  ngOnInit() {
    this.filterSavedQueries();
  }


  public filterHandler(event: FilterInfo): void {
    this.filterInfo = event;

    this.filterSavedQueries();
  }

  public async filterSavedQueries(): Promise<void> {
    const { search, sort, pagination } = this.filterInfo;

    const query = { $and: [] };

    if (search) {
      query.$and.push({ $or: [
        { name: { $contL: search } },
        { 'created_by.name': { $contL: search } },
      ] });
    }

    this.startLoading();

    const fetcher =  this.savedQueryService.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, sort);
    this.paginatedData = await firstValueFrom(fetcher).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} queries on page #${page.page}.`);
  }
}
