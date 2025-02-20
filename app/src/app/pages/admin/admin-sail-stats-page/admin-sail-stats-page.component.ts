import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Store,
} from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { DEFAULT_PAGINATION } from '../../../models/default-pagination';
import { FilterInfo } from '../../../models/filter-into';
import { viewProfileRoute } from '../../../routes/routes';
import { BasePageComponent } from '../../base-page/base-page.component';
import { SailStatsService } from '../../../services/sail-stats.service';
import { compare } from '../../../utils/compare';

@Component({
  selector: 'app-admin-sail-stats-page',
  templateUrl: './admin-sail-stats-page.component.html',
  styleUrls: ['./admin-sail-stats-page.component.scss']
})
export class AdminSailStatsPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
  public userSailsDataSource = new MatTableDataSource<any>([]);
  public userSailsDisplayedColumns: string[] = ['name', 'email', 'sails'];
  public userSails: any[] = [];
  public userSailsPaginatedData: any = {};
  public userSailsFilterInfo: FilterInfo = { search: '', pagination: { ...DEFAULT_PAGINATION }, sort: 'name,ASC' };

  public cancelledSailsDataSource = new MatTableDataSource<any>([]);
  public cancelledSailsDisplayedColumns: string[] = ['name', 'start_at', 'end_at', 'cancelled_at', 'cancelled_by', 'cancel_reason'];
  public cancelledSails: any[] = [];
  public cancelledSailsPaginatedData: any = {};
  public cancelledSailsFilterInfo: FilterInfo = { search: '', pagination: { ...DEFAULT_PAGINATION }, sort: 'start_at,ASC' };

  public boatSailsDataSource = new MatTableDataSource<any>([]);
  public boatSailsDisplayedColumns: string[] = ['boat_name', 'sails'];
  public boatSails: any[] = [];
  public boatSailsPaginatedData: any = {};
  public boatSailsFilterInfo: FilterInfo = { search: '', pagination: { ...DEFAULT_PAGINATION }, sort: 'start_at,ASC' };

  public currentYear: number = new Date().getFullYear();
  public sailYear: number = new Date().getFullYear();
  public viewProfileRoute = viewProfileRoute;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(Router) router: Router,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(SailStatsService) private sailStatsService: SailStatsService,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.fetch_stats(this.sailYear);
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
  }

  private async fetch_stats(year: number): Promise<void> {
    Promise.allSettled([
      this.fetch_user_sails(year),
      this.fetch_cancelled_sails(year),
      this.fetch_boat_sails(year),
    ]).finally(() => this.dispatchMessage(`Finished loading stats for ${this.sailYear}`));
  }

  private async fetch_user_sails(sail_year: number): Promise<void> {
    this.startLoading();

    try {
      this.userSails = await firstValueFrom(this.sailStatsService.get_user_sails(sail_year))
        .finally(() => this.finishLoading());

      this.userSailsPaginatedData = {
        data: this.userSails,
        count: this.userSails.length,
        total: this.userSails.length,
        page: 0,
        pageCount: 1
      };

      this.userSailsDataSource.data = this.userSails;
      this.userSailsFilterInfo.pagination.pageSize = this.userSails.length;

    } catch (error) {
      this.dispatchError(`Failed to get user sails: ${error.message}`);
      throw error;
    }
  }

  private async fetch_boat_sails(sail_year: number): Promise<void> {
    this.startLoading();

    try {
      this.boatSails = await firstValueFrom(this.sailStatsService.get_boat_sails(sail_year))
        .finally(() => this.finishLoading());

      this.boatSailsPaginatedData = {
        data: this.boatSails,
        count: this.boatSails.length,
        total: this.boatSails.length,
        page: 0,
        pageCount: 1
      };

      this.boatSailsDataSource.data = this.boatSails;
      this.boatSailsFilterInfo.pagination.pageSize = this.boatSails.length;

    } catch (error) {
      this.dispatchError(`Failed to get boat sails: ${error.message}`);
      throw error;
    }
  }

  private async fetch_cancelled_sails(sail_year: number): Promise<void> {
    this.startLoading();

    try {
      this.cancelledSails = await firstValueFrom(this.sailStatsService.get_cancelled_sails(sail_year))
        .finally(() => this.finishLoading());

      this.cancelledSailsPaginatedData = {
        data: this.cancelledSails,
        count: this.cancelledSails.length,
        total: this.cancelledSails.length,
        page: 0,
        pageCount: 1
      };

      this.cancelledSailsDataSource.data = this.cancelledSails;
      this.cancelledSailsFilterInfo.pagination.pageSize = this.cancelledSails.length;

    } catch (error) {
      this.dispatchError(`Failed to get cancelled sails: ${error.message}`);
      throw error;
    }
  }

  public filterUserSailsHandler(event: FilterInfo): void {
    const [sortField, sortDirection] = event.sort.split(',');
    const filteredData = this.userSails
      .filter((sail) => sail.name
        .includes(event.search)
        || sail.email.includes(event.search));

    const sortedData = filteredData.sort((a, b) => {
      if (sortField === 'email') {
        return compare(a.email, b.email, sortDirection, 'string');
      } else if (sortField === 'name') {
        return compare(a.name, b.name, sortDirection, 'string');
      } else if (sortField === 'sails') {
        return compare(a.sails, b.sails, sortDirection, 'number');
      }
      return 0;
    });

    this.userSailsDataSource.data = sortedData;
    this.userSailsPaginatedData.data = sortedData;
  }

  public filterBoatSailsHandler(event: FilterInfo): void {
    const [sortField, sortDirection] = event.sort.split(',');
    const filteredData = this.boatSails
      .filter((sail) => sail.boat_name
        .includes(event.search));

    const sortedData = filteredData.sort((a, b) => {
      if (sortField === 'boat_name') {
        return compare(a.boat_name, b.boat_name, sortDirection, 'string');
      } else if (sortField === 'sails') {
        return compare(a.sails, b.sails, sortDirection, 'number');
      }
      return 0;
    });

    this.boatSailsDataSource.data = sortedData;
    this.boatSailsPaginatedData.data = sortedData;
  }

  public filterCancelledSailsHandler(event: FilterInfo): void {
    const [sortField, sortDirection] = event.sort.split(',');
    const filteredData = this.cancelledSails
      .filter((sail) => sail.name
        .includes(event.search)
        || sail.cancelled_by.includes(event.search)
        || sail.cancel_reason.includes(event.search));

    const sortedData = filteredData.sort((a, b) => {
      if (sortField === 'name') {
        return compare(a.name, b.name, sortDirection, 'string');
      } else if (sortField === 'start_at') {
        return compare(a.start_at, b.start_at, sortDirection, 'date');
      } else if (sortField === 'end_at') {
        return compare(a.end_at, b.end_at, sortDirection, 'date');
      } else if (sortField === 'cancel_reason') {
        return compare(a.cancel_reason, b.cancel_reason, sortDirection, 'string');
      } else if (sortField === 'cancelled_by') {
        return compare(a.cancelled_by, b.cancelled_by, sortDirection, 'string');
      } else if (sortField === 'cancelled_at') {
        return compare(a.cancelled_at, b.cancelled_at, sortDirection, 'date');
      }

      return 0;
    });

    this.cancelledSailsDataSource.data = sortedData;
    this.cancelledSailsPaginatedData.data = sortedData;
  }

  public async get_previous_year(): Promise<void> {
    this.sailYear -= 1;
    this.fetch_stats(this.sailYear);
  }

  public async get_next_year(): Promise<void> {
    this.sailYear += 1;
    this.fetch_stats(this.sailYear);
  }

  public show_next_year(): boolean {
    return this.sailYear < this.currentYear;
  }

}
