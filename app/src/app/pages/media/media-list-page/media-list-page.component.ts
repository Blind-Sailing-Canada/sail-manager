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
import { firstValueFrom, takeWhile } from 'rxjs';
import { STORE_SLICES } from '../../../store/store';
import { MatDialog } from '@angular/material/dialog';
import { MediaType } from '../../../../../../api/src/types/media/media-type';
import { MatTableDataSource } from '@angular/material/table';
import { PaginatedMedia } from '../../../../../../api/src/types/media/paginated-media';
import { WindowService } from '../../../services/window.service';
import { DEFAULT_PAGINATION } from '../../../models/default-pagination';
import { FilterInfo } from '../../../models/filter-into';
import { editMediaRoute, listMediaRoute } from '../../../routes/routes';
import { ProfileRole } from '../../../../../../api/src/types/profile/profile-role';
import { MediaTagService } from '../../../services/media-tag.service';

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
  public filterInfo: FilterInfo = { search: '', pagination: { ...DEFAULT_PAGINATION }, sort: 'created_at,DESC' };
  public listMediaRoute = listMediaRoute.toString();
  public editMediaRoute = editMediaRoute;
  public tag_me = (media_id: string) => this._tag_me(media_id);

  constructor(
    @Inject(Router) router: Router,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Store) store: Store<any>,
    @Inject(MediaService) mediaService: MediaService,
    @Inject(MediaTagService) mediaTagService: MediaTagService,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(WindowService) public windowService: WindowService,
  ) {
    super(store, route, router, dialog, mediaService, mediaTagService);
  }

  ngOnInit() {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);

    this.route.queryParams
      .pipe(takeWhile(() => this.active && !!this.user))
      .subscribe((params) => {
        if (params.page === undefined) {
          return;
        }
        this.updateFilter(params);
        this.filterMedia();
      });

    this.updateFilter(this.route.snapshot.queryParams);
    this.updateMediaUrl();
  }

  private updateFilter(params) {
    this.entities = (params.entity || '').split(',').filter(Boolean);
    this.mediaType = params.media_type ?? 'ANY';

    const filterInfo = { ...this.filterInfo };

    filterInfo.pagination.pageIndex = (params.page ?? 1) - 1;
    filterInfo.pagination.pageSize = params.per_page ?? DEFAULT_PAGINATION.pageSize;
    filterInfo.sort = params.sort ?? 'created_at,DESC';
    filterInfo.search = params.search ?? '';

    this.filterInfo = filterInfo;
  }

  public get posted_by_id() {
    return this.route.snapshot.queryParamMap.get('posted_by_id') || undefined;
  }

  private async _tag_me(media_id: string) {
    await this.tagProfile(this.user.profile.id, media_id);
  }

  public get tagged_profile_id() {
    return this.route.snapshot.queryParamMap.get('tagged_profile_id') || undefined;
  }

  public canEditMedia(media: Media): boolean {
    if (this.user.roles.includes(ProfileRole.Admin)) {
      return true;
    }

    return media.posted_by_id === this.user.profile.id;
  }

  public updateMediaUrl() {
    const { pagination, sort } = this.filterInfo;
    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: {
          entity: this.entities.join(','),
          media_type: this.mediaType,
          page: pagination.pageIndex + 1,
          per_page: pagination.pageSize,
          search: this.filterInfo.search,
          posted_by_id: this.posted_by_id,
          tagged_profile_id: this.tagged_profile_id,
          sort,
        },
        queryParamsHandling: 'merge',
        replaceUrl: this.route.snapshot.queryParams.page === undefined,
      });
  }

  private buildQuery() {
    const { search } = this.filterInfo;
    const query = { $and: [] };

    if (this.entities.length) {
      query.$and.push({ media_for_type: { $in: this.entities } });
    }

    if (this.posted_by_id) {
      query.$and.push({ posted_by_id: this.posted_by_id });
    }

    if (this.tagged_profile_id) {
      query.$and.push({ 'tags.profile_id': this.tagged_profile_id });
    }

    if (search) {
      query.$and.push({
        $or: [
          { url: { $contL: search } },
          { title: { $contL: search } },
          { description: { $contL: search } },
          { 'posted_by.name': { $contL: search } },
        ]
      });
    }

    if (this.mediaType !== 'ANY') {
      query.$and.push({ media_type: this.mediaType });
    }

    const joins = [];

    joins.push('posted_by');

    if (this.tagged_profile_id) {
      joins.push('tags');
    }

    return { query, joins };
  }

  private async filterMedia(): Promise<void> {
    const { query, joins } = this.buildQuery();
    const { pagination, sort } = this.filterInfo;

    this.startLoading();

    const fetcher = this.mediaService.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, sort, joins);
    this.paginatedData = await firstValueFrom(fetcher).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} media on page #${page.page}.`);
  }

  public filterHandler(event: FilterInfo): void {
    this.filterInfo = event;

    this.updateMediaUrl();
  }

}
