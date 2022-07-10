import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { MediaService } from '../../../services/media.service';
import { Media } from '../../../../../../api/src/types/media/media';
import { debounceTime, filter, firstValueFrom, fromEvent, map, switchMap, takeWhile } from 'rxjs';
import { STORE_SLICES } from '../../../store/store';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MediaType } from '../../../../../../api/src/types/media/media-type';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatedMedia } from '../../../../../../api/src/types/media/paginated-media';
import { WindowService } from '../../../services/window.service';
import { DEFAULT_PAGINATION } from '../../../models/default-pagination';

@Component({
  selector: 'app-media-list-page',
  styleUrls: ['./media-list-page.component.css'],
  templateUrl: './media-list-page.component.html',
})
export class MediaListPageComponent extends BasePageComponent implements OnInit, AfterViewInit {

  public dataSource = new MatTableDataSource<Media>([]);
  public displayedColumns: string[] = ['url', 'title', 'posted_by', 'media_type', 'created_at', 'action'];
  public displayedColumnsSmall: string[] = ['url', 'posted_by', 'action'];
  public entities: string[] = [];
  public filter: string;
  public mediaType: MediaType | 'ANY' = 'ANY';
  public mediaTypeValues = { ...MediaType, ANY: 'ANY' };
  public paginatedData: PaginatedMedia;
  public pagination = DEFAULT_PAGINATION;
  public sort: string;
  public MediaTypes = MediaType;
  public width = 100;
  public height = 100;
  public EntityLabels = {
    SailEntity: 'sail',
    SocialEntity: 'social',
  };

  @ViewChild('filterInput', { static: false }) private filterInput;

  constructor(
    @Inject(Router) router: Router,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Store) store: Store<any>,
    @Inject(MediaService) private mediaService: MediaService,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(WindowService) public windowServer: WindowService,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    this.entities = (this.route.snapshot.queryParams.entity || '').split(',').filter(Boolean);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.filterMedia();
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
          return this.filterMedia();
        }),
      );

    typeAhead.subscribe();

    super.ngAfterViewInit();
  }

  public async filterMedia(): Promise<void> {
    const pagination = this.pagination;
    const query = { $and: [] };

    if (this.entities.length) {
      query.$and.push({ media_for_type: { $in:  this.entities } });
    }

    if (this.filter) {
      query.$and.push({ $or: [
        { url: { $contL: this.filter } },
        { title: { $contL: this.filter } },
        { description: { $contL: this.filter } },
        { 'posted_by.name': { $contL: this.filter } },
      ] });
    }

    if (this.mediaType !== 'ANY') {
      query.$and.push({ media_type: this.mediaType });
    }

    this.startLoading();

    const mediaFetch =  this.mediaService.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, this.sort);
    this.paginatedData = await firstValueFrom(mediaFetch).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} media on page #${page.page}.`);
  }

  public paginationHandler(event: PageEvent) {
    this.pagination = event;
    this.filterMedia();
  }

  public sortHandler(event: Sort) {
    if (event.direction) {
      this.sort = `${event.active},${event.direction.toUpperCase()}`;
    } else {
      this.sort = '';
    }

    this.filterMedia();
  }

}
