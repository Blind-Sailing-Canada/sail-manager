import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  createSocialRoute, listMediaRoute, viewSocialPicturesRoute,
} from '../../../routes/routes';
import { BasePageComponent } from '../../base-page/base-page.component';
import { Access } from '../../../../../../api/src/types/user-access/access';
import { ProfileRole } from '../../../../../../api/src/types/profile/profile-role';
import { STORE_SLICES } from '../../../store/store';
import { MatTableDataSource } from '@angular/material/table';
import { SocialService } from '../../../services/social.service';
import { firstValueFrom } from 'rxjs';
import { Social } from '../../../../../../api/src/types/social/social';
import { PaginatedSocial } from '../../../../../../api/src/types/social/paginated-social';
import { SocialStatus } from '../../../../../../api/src/types/social/social-status';
import { DEFAULT_PAGINATION } from '../../../models/default-pagination';
import { WindowService } from '../../../services/window.service';
import { FilterInfo } from '../../../models/filter-into';

@Component({
  selector: 'app-social-list-page',
  styleUrls: ['./social-list-page.component.scss'],
  templateUrl: './social-list-page.component.html',
})
export class SocialListPageComponent extends BasePageComponent implements OnInit  {
  public CREATE_SOCIAL_ROUTE = createSocialRoute.toString();
  public dataSource = new MatTableDataSource<Social>([]);
  public displayedColumns: string[] = ['entity_number', 'name', 'start_at', 'end_at', 'manifest', 'status', 'action'];
  public displayedColumnsMobile: string[] = ['name'];
  public filterInfo: FilterInfo = { search: '', pagination: DEFAULT_PAGINATION, sort: 'start_at,ASC' };
  public paginatedData: PaginatedSocial;
  public socialStatus: SocialStatus | 'ANY' = SocialStatus.New;
  public socialStatusValues = { ...SocialStatus, ANY: 'ANY' };

  constructor(
    @Inject(Router) router: Router,
    @Inject(Store) store: Store<any>,
    @Inject(SocialService) private socialService: SocialService,
    @Inject(WindowService) public windowService: WindowService,
  ) {
    super(store, undefined, router);
  }

  ngOnInit() {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SOCIALS);
    this.filterSocials();
  }

  public socialAddressUrl(social: Social): string {
    if (social.address.startsWith('http')) {
      return social.address;
    }

    return `https://maps.google.com/?q=${social.address.replace(/\s/g, '+')}`;
  }

  public goToSocialsPictures() {
    this.goTo([listMediaRoute], { queryParams: { entity: 'SocialEntity' } });
  }

  public goToSocialPictures(socialId: string) {
    this.goTo([viewSocialPicturesRoute(socialId)]);
  }

  public goToViewSocial(id: string): void {
    this.viewSocial(id);
  }

  public get allowCreation(): boolean {
    const user = this.user;

    if (!user) {
      return false;
    }

    const roles: string[] = user.roles || [];
    const access: Access = user.access || {};

    const should = access.createSocial || roles.some(role => [ProfileRole.Admin, ProfileRole.Coordinator].includes(role as ProfileRole));

    return should;
  }

  public socialPicture(social: Social): string {
    if (!social.pictures?.length) {
      return '/assets/icons/local_bar_black_48dp.svg';
    }

    return `${social.pictures[0].url}?height=300`;
  }

  public async filterSocials(): Promise<void> {
    const { search, sort, pagination } = this.filterInfo;

    const query = { $and: [] };

    if (search) {
      query.$and.push({ $or: [
        { name: { $contL: search } },
        { description: { $contL: search } },
        { 'manifest.profile.name': { $contL: search } },
      ] });
    }

    if (this.socialStatus !== 'ANY') {
      query.$and.push({ status: this.socialStatus });
    }

    this.startLoading();

    const fetcher =  this.socialService.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, sort);
    this.paginatedData = await firstValueFrom(fetcher).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} socials on page #${page.page}.`);
  }

  public statusHandler(): void {
    this.filterInfo.pagination.pageIndex = 0;

    this.filterSocials();
  }

  public filterHandler(event: FilterInfo): void {
    this.filterInfo = event;

    this.filterSocials();
  }
}
