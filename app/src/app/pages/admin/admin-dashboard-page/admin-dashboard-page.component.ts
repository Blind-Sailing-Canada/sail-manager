import {
  firstValueFrom,
} from 'rxjs';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  adminPaymentDashboardRoute,
  adminSailFeedbackRoute,
  editProfilePrivilegesRoute, FullRoutes, listSailCategoriesRoute, missingSailPaymentsRoute, viewGroupMembersRoute,
} from '../../../routes/routes';
import { ProfileService } from '../../../services/profile.service';
import { BasePageComponent } from '../../base-page/base-page.component';
import { Profile } from '../../../../../../api/src/types/profile/profile';
import { ProfileStatus } from '../../../../../../api/src/types/profile/profile-status';
import { CreateUserDialogComponent } from '../../../components/create-user-dialog/create-user-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateUserDialogData } from '../../../models/create-user-dialog-data.interface';
import { MatTableDataSource } from '@angular/material/table';
import { FilterInfo } from '../../../models/filter-into';
import { DEFAULT_PAGINATION } from '../../../models/default-pagination';
import { PaginatedProfile } from '../../../../../../api/src/types/profile/paginated-profile';
import { WindowService } from '../../../services/window.service';

@Component({
  selector: 'app-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.component.html',
  styleUrls: ['./admin-dashboard-page.component.scss']
})
export class AdminDashboardPageComponent extends BasePageComponent implements OnInit, AfterViewInit {

  public adminPaymentDashboardRoute = adminPaymentDashboardRoute;
  public adminSailFeedbackRoute = adminSailFeedbackRoute;
  public createUserDialogRef: MatDialogRef<CreateUserDialogComponent>;
  public dataSource = new MatTableDataSource<Profile>([]);
  public dbQueryRoute = FullRoutes.SAVED_QUERY;
  public displayedColumns: string[] = ['photo', 'name', 'roles', 'created_at', 'last_login', 'status', 'action'];
  public displayedColumnsMobile: string[] = ['name'];
  public filterInfo: FilterInfo = { search: '', pagination: DEFAULT_PAGINATION, sort: 'name,ASC' };
  public listSailCategoriesRoute = listSailCategoriesRoute;
  public missingSailPaymentsRoute = missingSailPaymentsRoute;
  public paginatedData: PaginatedProfile;
  public pendingApproval: Profile[];
  public profile_id: string;
  public profileLink = editProfilePrivilegesRoute;
  public profileStatus: ProfileStatus | 'ANY' = 'ANY';
  public profileStatusValues = { ...ProfileStatus, ANY: 'ANY' };
  public viewGroupMembersRoute = viewGroupMembersRoute;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ProfileService) private profileService: ProfileService,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(WindowService) public windowService: WindowService,
  ) {
    super(store, undefined, router, dialog);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.fetchPendingProfiles();
    this.filterProfiles();
  }

  public profileThumbnail(profile: Profile): string {
    return `${profile.photo || 'assets/icons/icon-person.png'}?width=200`;
  }

  public fetchPendingProfiles(): void {
    this.profileService
      .fetchAllPaginated({ status:ProfileStatus.PendingApproval })
      .subscribe((result) => {
        this.pendingApproval = result.data;
        this.pendingApproval.sort((a, b) => a.name.localeCompare(b.name));
      });
  }

  public editProfilePrivileges(profile: Profile): void {
    this.goTo([editProfilePrivilegesRoute(profile.id)]);
  }

  public openCreateUserDialog(): void {
    const dialogData: CreateUserDialogData = {
      createUser: (name, email) => this.createUser(name, email)
    };

    this.createUserDialogRef = this.dialog
      .open(CreateUserDialogComponent, {
        width: '90%',
        maxWidth: 500,
        data: dialogData,
      });
  }

  private createUser(name: string, email: string): Promise<void> {
    return this.profileService.createUser(name, email).toPromise()
      .then(createdUser => this.editProfilePrivileges({ id: createdUser.profile_id } as Profile))
      .then(() => this.dispatchMessage('User created.'))
      .catch((error) => {
        console.error(error);
        this.dispatchError(`Failed to create user. ${error.error?.message || ''}.`);
        throw new Error(error.error?.message || error.message);
      });
  }

  public async filterProfiles(): Promise<void> {
    const { search, sort, pagination } = this.filterInfo;

    const query = { $and: [] };

    if (search) {
      query.$and.push({ $or: [
        { name: { $contL: search } },
        { email: { $contL: search } },
        { phone: { $contL: search } },
        { bio: { $contL: search } },
      ] });
    }

    if (this.profileStatus !== 'ANY') {
      query.$and.push({ status: this.profileStatus });
    }

    this.startLoading();

    const fetcher =  this.profileService.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, sort);
    this.paginatedData = await firstValueFrom(fetcher).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} profiles on page #${page.page}.`);
  }

  public filterHandler(event: FilterInfo): void {
    this.filterInfo = event;

    this.filterProfiles();
  }

}
