import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  createSocialRoute, listMediaRoute,
} from '../../../routes/routes';
import { BasePageComponent } from '../../base-page/base-page.component';
import { Access } from '../../../../../../api/src/types/user-access/access';
import { ProfileRole } from '../../../../../../api/src/types/profile/profile-role';
import { STORE_SLICES } from '../../../store/store';
import { MatTableDataSource } from '@angular/material/table';
import { SocialService } from '../../../services/social.service';
import { debounceTime, filter, firstValueFrom, fromEvent, map, switchMap, takeWhile } from 'rxjs';
import { Social } from '../../../../../../api/src/types/social/social';
import { PaginatedSocial } from '../../../../../../api/src/types/social/paginated-social';
import { SocialStatus } from '../../../../../../api/src/types/social/social-status';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-social-list-page',
  styleUrls: ['./social-list-page.component.css'],
  templateUrl: './social-list-page.component.html',
})
export class SocialListPageComponent extends BasePageComponent implements OnInit, AfterViewInit  {
  public CREATE_SOCIAL_ROUTE = createSocialRoute.toString();
  public displayedColumns: string[] = ['entity_number', 'name', 'start_at', 'end_at', 'manifest', 'status'];
  public dataSource = new MatTableDataSource<Social>([]);
  public paginatedData: PaginatedSocial;
  public filter: string;
  public sort: string;
  public socialStatus: SocialStatus | 'ANY' = SocialStatus.New;
  public socialStatusValues = { ...SocialStatus, ANY: 'ANY' };
  public pagination: PageEvent = { pageIndex: 0, length: 0, pageSize: 20, previousPageIndex: 0 };

  @ViewChild('filterInput', { static: false }) private filterInput;

  constructor(
    @Inject(Router) router: Router,
    @Inject(Store) store: Store<any>,
    @Inject(SocialService) private socialService: SocialService,
  ) {
    super(store, undefined, router);
  }

  ngOnInit() {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SOCIALS);
    this.filterSocials();
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
          return this.filterSocials();
        }),
      );

    typeAhead.subscribe();

    super.ngAfterViewInit();
  }

  public goToSocialPictures() {
    this.goTo([listMediaRoute], { queryParams: { entity: 'SocialEntity' } });
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


  public async filterSocials(): Promise<void> {
    const pagination = this.pagination;
    const query = { $and: [] };

    if (this.filter) {
      query.$and.push({ $or: [
        { name: { $contL: this.filter } },
        { description: { $contL: this.filter } },
        { 'manifest.profile.name': { $contL: this.filter } },
      ] });
    }

    if (this.socialStatus !== 'ANY') {
      query.$and.push({ status: this.socialStatus });
    }

    this.startLoading();

    const mediaFetch =  this.socialService.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, this.sort);
    this.paginatedData = await firstValueFrom(mediaFetch).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} socials on page #${page.page}.`);
  }

  public paginationHandler(event: PageEvent) {
    this.pagination = event;
    this.filterSocials();
  }

  public sortHandler(event: Sort) {
    if (event.direction) {
      this.sort = `${event.active},${event.direction.toUpperCase()}`;
    } else {
      this.sort = '';
    }

    this.filterSocials();
  }
}
