import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { BasePageComponent } from '../../base-page/base-page.component';
import { Access } from '../../../../../../api/src/types/user-access/access';
import { ProfileRole } from '../../../../../../api/src/types/profile/profile-role';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';
import { MediaService, PaginatedMedia } from '../../../services/media.service';
import { MediaQuery } from '../../../../../../api/src/types/media/media-query';
import { Media } from '../../../../../../api/src/types/media/media';
import { firstValueFrom, take } from 'rxjs';
import { STORE_SLICES } from '../../../store/store';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-media-list-page',
  styleUrls: ['./media-list-page.component.css'],
  templateUrl: './media-list-page.component.html',
})
export class MediaListPageComponent extends BasePageComponent implements OnInit {

  public allowDelete = false;
  public entity: string;
  public media: Media[] = [];
  public paginatedData: PaginatedMedia;

  constructor(
    @Inject(Router) router: Router,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Store) store: Store<any>,
    @Inject(MediaService) private mediaService: MediaService,
    @Inject(MatDialog) dialog: MatDialog,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    this.entity = this.route.snapshot.queryParams.entity;
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.fetchMedia();
  }

  public goToViewSail(id: string): void {
    this.viewSail(id);
  }

  public async fetchMedia(pagination: PageEvent = { pageIndex: 0, length: 0, pageSize: 20, previousPageIndex: 0 }): Promise<void> {
    const query: MediaQuery = { media_for_type: this.entity };

    const mediaFetch =  this.mediaService.getPaginatedMedia(query, pagination.pageIndex + 1, pagination.pageSize);
    this.paginatedData = await firstValueFrom(mediaFetch);
    this.media = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} pictures on page #${page.page}.`);
  }

  public paginationHandler(event: PageEvent) {
    this.fetchMedia(event);
  }

  public deleteMedia(media: Media): void {
    this.mediaService
      .delete(media.id)
      .pipe(take(1))
      .subscribe(() => this.fetchMedia());
  }

  public get shouldShowControls(): boolean {
    const user = this.user;

    if (!user) {
      return false;
    }

    const roles: string[] = user.roles || [];
    const access: Access = user.access || {};

    const should = access[UserAccessFields.CreateSail] ||
      roles.some(role => role === ProfileRole.Admin || role === ProfileRole.Coordinator);

    return should;
  }

}
