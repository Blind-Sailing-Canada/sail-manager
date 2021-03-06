import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { MediaService } from '../../../services/media.service';
import { Media } from '../../../../../../api/src/types/media/media';
import { firstValueFrom } from 'rxjs';
import { STORE_SLICES } from '../../../store/store';
import { MatDialog } from '@angular/material/dialog';
import { MediaType } from '../../../../../../api/src/types/media/media-type';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatedMedia } from '../../../../../../api/src/types/media/paginated-media';
import { WindowService } from '../../../services/window.service';
import { DEFAULT_PAGINATION } from '../../../models/default-pagination';
import { FilterInfo } from '../../../models/filter-into';

@Component({
  selector: 'app-media-list-page',
  styleUrls: ['./media-list-page.component.scss'],
  templateUrl: './media-list-page.component.html',
})
export class MediaListPageComponent extends BasePageComponent implements OnInit, AfterViewInit {

  public dataSource = new MatTableDataSource<Media>([]);
  public displayedColumns: string[] = ['url', 'title', 'posted_by', 'media_type', 'created_at', 'action'];
  public displayedColumnsMobile: string[] = ['url'];
  public entities: string[] = [];
  public mediaType: MediaType | 'ANY' = 'ANY';
  public mediaTypeValues = { ...MediaType, ANY: 'ANY' };
  public paginatedData: PaginatedMedia;
  public MediaTypes = MediaType;
  public width = 100;
  public height = 100;
  public EntityLabels = {
    SailEntity: 'sail',
    SocialEntity: 'social',
  };
  public filterInfo: FilterInfo = { search: '', pagination: DEFAULT_PAGINATION, sort: 'created_at,DESC' };

  constructor(
    @Inject(Router) router: Router,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Store) store: Store<any>,
    @Inject(MediaService) private mediaService: MediaService,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(WindowService) public windowService: WindowService,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    this.entities = (this.route.snapshot.queryParams.entity || '').split(',').filter(Boolean);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.filterMedia();
  }

  public async filterMedia(): Promise<void> {
    const { search, sort, pagination } = this.filterInfo;
    const query = { $and: [] };

    if (this.entities.length) {
      query.$and.push({ media_for_type: { $in:  this.entities } });
    }

    if (search) {
      query.$and.push({ $or: [
        { url: { $contL: search } },
        { title: { $contL: search } },
        { description: { $contL: search } },
        { 'posted_by.name': { $contL: search } },
      ] });
    }

    if (this.mediaType !== 'ANY') {
      query.$and.push({ media_type: this.mediaType });
    }

    this.startLoading();

    const fetcher =  this.mediaService.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, sort);
    this.paginatedData = await firstValueFrom(fetcher).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} media on page #${page.page}.`);
  }

  public filterHandler(event: FilterInfo): void {
    this.filterInfo = event;

    this.filterMedia();
  }

}
