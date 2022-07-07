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
  public entities: string[] = [];
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
    this.entities = (this.route.snapshot.queryParams.entity || '').split(',').filter(Boolean);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.fetchMedia();
  }

  public async fetchMedia(pagination: PageEvent = { pageIndex: 0, length: 0, pageSize: 20, previousPageIndex: 0 }): Promise<void> {
    const query = { } as any;

    if (this.entities.length) {
      query.media_for_type = { $in:  this.entities };
    }

    const mediaFetch =  this.mediaService.getPaginatedMedia(query, pagination.pageIndex + 1, pagination.pageSize);
    this.paginatedData = await firstValueFrom(mediaFetch);
    this.media = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} pictures on page #${page.page}.`);
  }

  public paginationHandler(event: PageEvent) {
    this.fetchMedia(event);
  }

  public goToEntity(event: { id: string; type: string }): void {
    switch(event.type) {
      case 'SailEntity':
        this.viewSail(event.id);
        break;
      case 'SocialEntity':
        this.viewSocial(event.id);
    }
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
