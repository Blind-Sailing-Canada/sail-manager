import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Store,
} from '@ngrx/store';
import { debounceTime, filter, firstValueFrom, fromEvent, map, takeWhile } from 'rxjs';
import { PaginatedSailFeedback } from '../../../../../../api/src/types/sail-feedback/paginated-sail-feedback';
import { SailFeedback } from '../../../../../../api/src/types/sail-feedback/sail-feedback';
import { DEFAULT_PAGINATION } from '../../../models/default-pagination';
import { FilterInfo } from '../../../models/filter-into';
import { viewSailRoute } from '../../../routes/routes';
import { FeedbackService } from '../../../services/feedback.service';
import { WindowService } from '../../../services/window.service';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-admin-sail-feedback-page',
  templateUrl: './admin-sail-feedback-page.component.html',
  styleUrls: ['./admin-sail-feedback-page.component.scss']
})
export class AdminSailFeedbackPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
  public dataSource = new MatTableDataSource<SailFeedback>([]);
  public displayedColumns: string[] = ['sail.entity_number', 'feedback', 'rating', 'created_at', 'action'];
  public displayedColumnsMobile: string[] = ['created_at'];
  public feedbackRating: number;
  public feedbackYear: number = new Date().getFullYear();
  public filterInfo: FilterInfo = { search: '', pagination: DEFAULT_PAGINATION, sort: 'created_at,DESC' };
  public hasFeedback = true;
  public paginatedData: PaginatedSailFeedback;
  public viewSailRoute = viewSailRoute;

  @ViewChild('feedbackRatingInput', { static: false }) private feedbackRatingInput;
  @ViewChild('feedbackYearInput', { static: false }) private feedbackYearInput;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(Router) router: Router,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(FeedbackService) private feedbackService: FeedbackService,
    @Inject(WindowService) public windowService: WindowService,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.filterSailFeedback();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    const typeAheadYear = fromEvent(this.feedbackYearInput.nativeElement, 'input')
      .pipe(
        takeWhile(() => this.active),
        map((event: any) => (event.target.value || '') as string),
        debounceTime(1000),
        map(text => text ? text.trim() : ''),
        filter(text => text === '' || (Number.isInteger(+text) && +text > 2000))
      );

    typeAheadYear
      .subscribe((year: string) => {
        this.feedbackYear = +year;
        this.filterSailFeedback();
      });

    const typeAheadRating = fromEvent(this.feedbackRatingInput.nativeElement, 'input')
      .pipe(
        takeWhile(() => this.active),
        map((event: any) => (event.target.value || '') as string),
        debounceTime(1000),
        map(text => text ? text.trim() : ''),
        filter(text => text === '' || Number.isInteger(+text))
      );

    typeAheadRating
      .subscribe((year: string) => {
        this.feedbackRating = +year;
        this.filterSailFeedback();
      });

  }

  public async filterSailFeedback(): Promise<void> {
    const { search, sort, pagination } = this.filterInfo;

    const query = { $and: [] };

    if (search) {
      query.$and.push({ $or: [
        { feedback: { $contL: search } },
      ] });
    }


    if (this.feedbackYear) {
      const startYear = new Date(this.feedbackYear, 0, 1, 0, 0, 0);
      const endYear = new Date(this.feedbackYear, 11, 31, 23, 59,59);

      query.$and.push({ created_at: { $gte: startYear } });
      query.$and.push({ created_at: { $lte: endYear } });
    }

    if (this.feedbackRating) {
      query.$and.push({ rating: this.feedbackRating });
    }

    if (this.hasFeedback) {
      query.$and.push({ feedback: { $notnull: true } });
    }

    this.startLoading();

    const fetcher =  this.feedbackService.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, sort);
    this.paginatedData = await firstValueFrom(fetcher).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} sail feedbacks on page #${page.page}.`);
  }

  public filterHandler(event: FilterInfo): void {
    this.filterInfo = event;

    this.filterSailFeedback();
  }


}
