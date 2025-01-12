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
import { SailChecklist } from '../../../../../../api/src/types/sail-checklist/sail-checklist';
import { PaginatedSailChecklist } from '../../../../../../api/src/types/sail-checklist/paginated-sail-checklist';
import { DEFAULT_PAGINATION } from '../../../models/default-pagination';
import { FilterInfo } from '../../../models/filter-into';
import { MomentService } from '../../../services/moment.service';
import { BasePageComponent } from '../../base-page/base-page.component';
import { SailChecklistService } from '../../../services/sail-checklist.service';
import { firstValueFrom } from 'rxjs';
import { viewSailChecklistRoute, viewSailRoute } from '../../../routes/routes';

@Component({
  selector: 'app-sail-checklist-list-page',
  templateUrl: './sail-checklist-list-page.component.html',
  styleUrls: ['./sail-checklist-list-page.component.scss']
})
export class SailChecklistListPageComponent extends BasePageComponent implements OnInit {

  public boatName: string = null;
  public boat_id: string = null;
  public excludeSailId: string = null;

  public dataSource = new MatTableDataSource<SailChecklist>([]);
  public displayedColumns: string[] = ['sail.entity_number', 'created_at', 'sail.name', 'sail.boat.name', 'checklist_type', 'action'];
  public filterInfo: FilterInfo = { search: '', pagination: { ...DEFAULT_PAGINATION }, sort: 'created_at,DESC' };
  public paginatedData: PaginatedSailChecklist;
  public viewSailChecklistRoute = viewSailChecklistRoute;
  public viewSailRoute = viewSailRoute;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(MomentService) private momentService: MomentService,
    @Inject(SailChecklistService) private sailChecklistService: SailChecklistService,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    this.boat_id = this.route.snapshot.queryParams.boat_id;
    this.boatName = this.route.snapshot.queryParams.boatName;
    this.excludeSailId = this.route.snapshot.queryParams.excludeSailId;
    this.filterSailChecklists();
  }

  public formatDate(date: Date | string): string {
    return this.momentService.humanizeDateWithTime(date, true);
  }

  public async filterSailChecklists(): Promise<void> {
    const { search, sort, pagination } = this.filterInfo;

    const query = { $and: [] };

    if (search) {
      query.$and.push({
        $or: [
          { 'sail.name': { $contL: search } },
          { 'sail.boat.name': { $contL: search } },
          { comments: { $contL: search } },
          { weather: { $contL: search } },
          { sail_destination: { $contL: search } },
        ]
      });
    }

    if (this.excludeSailId) {
      query.$and.push({
        'sail.id': { $ne: this.excludeSailId },
      });
    }

    if (this.boat_id) {
      query.$and.push({
        'sail.boat_id': this.boat_id
      });
    }


    this.startLoading();

    const fetcher = this.sailChecklistService.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, sort);
    this.paginatedData = await firstValueFrom(fetcher).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} checklists on page #${page.page}.`);
  }

  public filterHandler(event: FilterInfo): void {
    this.filterInfo = event;

    this.filterSailChecklists();
  }

}
