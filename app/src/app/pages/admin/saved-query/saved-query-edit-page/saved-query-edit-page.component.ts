import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';
import { SavedQuery } from '../../../../../../../api/src/types/saved-query/saved-query';
import { editSavedQueryRoute, listSavedQueryRoute } from '../../../../routes/routes';
import { SaveQueryService } from '../../../../services/saved-query.service';
import { BasePageComponent } from '../../../base-page/base-page.component';

@Component({
  selector: 'app-saved-query-edit-page',
  templateUrl: './saved-query-edit-page.component.html',
  styleUrls: ['./saved-query-edit-page.component.scss']
})
export class SavedQueryEditPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
  public headers = [];
  public results: any[] = [];
  public saved_query_id = null;
  public dataSource = new MatTableDataSource(this.results);
  public queryForm: UntypedFormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(SaveQueryService) private savedQueryService: SaveQueryService,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(UntypedFormBuilder) private fb: UntypedFormBuilder
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    this.saved_query_id = this.route.snapshot.params.id;

    this.buildForm();

    if (this.saved_query_id) {
      this.fetchSavedQuery();
    }
  }

  ngAfterViewInit() {
    this.paginator.pageSize = 100;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private buildForm(): void {
    this.queryForm = this.fb.group({
      name: new UntypedFormControl('', Validators.required),
      query: new UntypedFormControl('', Validators.required),
      created_by_id: new UntypedFormControl(this.user.profile.id)
    });
  }

  private updateForm(savedQuery: SavedQuery): void {
    this.queryForm.patchValue(savedQuery);
    this.queryForm.markAsPristine();
    this.queryForm.markAsUntouched();
  }

  public get isFormValid(): boolean {
    return this.queryForm.valid && !this.loading;
  }

  public get canSave(): boolean {
    return this.queryForm.valid && this.queryForm.dirty && !this.loading;
  }

  public async fetchSavedQuery() {
    this.startLoading();

    const fetcher = this.savedQueryService.fetchSavedQuery(this.saved_query_id);

    await firstValueFrom(fetcher)
      .then((data) => {
        this.updateForm(data);
      })
      .catch((error) => {
        this.dispatchError(error.error?.message || error.message || error);
      })
      .finally(() => this.finishLoading());
    this.headers = Object.keys(this.results[0] || {});

  }

  public async createSavedQuery() {
    this.startLoading();

    const fetcher = this.savedQueryService
      .createSavedQuery(this.queryForm.getRawValue());

    await firstValueFrom(fetcher)
      .then((data) => {
        this.dispatchMessage(`Created DB query "${data.name}"`);
        this.goTo([editSavedQueryRoute(data.id)]);
      })
      .catch((error) => {
        this.dispatchError(error.error?.message || error.message || error);
      })
      .finally(() => this.finishLoading());
  }

  public async updateSavedQuery() {
    this.startLoading();

    const fetcher = this.savedQueryService
      .updateSavedQuery(this.saved_query_id, this.queryForm.getRawValue());

    await firstValueFrom(fetcher)
      .then((data) => {
        this.dispatchMessage('Saved DB query');
        this.updateForm(data);
      })
      .catch((error) => {
        this.dispatchError(error.error?.message || error.message || error);
      })
      .finally(() => this.finishLoading());

  }

  public cellData(data) {
    if (!data) {
      return data;
    }

    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2);
    }

    return data;
  }

  public async deleteSavedQuery(): Promise<void> {
    this.startLoading();

    const fetcher = this.savedQueryService
      .deleteSavedQuery(this.saved_query_id);

    await firstValueFrom(fetcher)
      .then((data) => {
        this.dispatchMessage(`Deleted DB query "${this.queryForm.controls.name.value}`);
        this.goTo([listSavedQueryRoute()]);
      })
      .catch((error) => {
        this.dispatchError(error.error?.message || error.message || error);
      })
      .finally(() => this.finishLoading());
  }

  public async runQuery() {
    this.startLoading();

    const fetcher = this.savedQueryService.runQuery(this.queryForm.controls.query.value);
    this.results = await firstValueFrom(fetcher)
      .then((data) => {
        this.dispatchMessage(`fetched ${data?.length || 0} results`);
        return data;
      })
      .catch((error) => {
        this.dispatchError(error.error?.message || error.message || error);
        return [];
      })
      .finally(() => this.finishLoading());
    this.headers = Object.keys(this.results[0] || {});

    this.dataSource.data = this.results;
  }

  public async downloadQuery() {
    this.startLoading();

    const fetcher = this.savedQueryService.downloadQuery(this.queryForm.controls.query.value);
    await firstValueFrom(fetcher)
      .then((data) => {
        const blob = new Blob([data], { type: 'text/csv' });
        const date = new Date();

        const fileName = `${this.queryForm.controls.name.value}-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.csv`;

        const link = document.createElement('a');

        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
      })
      .catch((error) => {
        this.dispatchError(error.error?.message || error.message || error);
        return [];
      })
      .finally(() => this.finishLoading());
  }
}
