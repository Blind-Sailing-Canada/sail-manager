import {
  AfterViewInit,
  Component,
  Inject,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { AdminService } from '../../../services/admin.service';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-admin-db-page',
  templateUrl: './admin-db-page.component.html',
  styleUrls: ['./admin-db-page.component.scss']
})
export class AdminDBPageComponent extends BasePageComponent implements AfterViewInit {
  public query = 'SELECT * FROM profiles;';
  public headers = [];
  public results: any[] = [];
  public dataSource = new MatTableDataSource(this.results);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(AdminService) private adminService: AdminService) {
    super(store);
  }

  ngAfterViewInit() {
    this.query = 'SELECT * FROM profiles;';
    this.paginator.pageSize = 100;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public async runQuery() {
    this.startLoading();

    const fetcher = this.adminService.runQuery(this.query);
    this.results = await firstValueFrom(fetcher)
      .then((data) => {
        this.dispatchMessage(`fetched ${data?.length || 0} results`);
        return data;
      })
      .catch((error) => {
        console.log('error', error);
        this.dispatchError(error.error?.message || error.message || error);
        return [];
      })
      .finally(() => this.finishLoading());
    this.headers = Object.keys(this.results[0] || {});

    this.dataSource.data = this.results;
  }
}
