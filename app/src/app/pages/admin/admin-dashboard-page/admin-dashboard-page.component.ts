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
import { IProfileMap } from '../../../models/profile-state.interface';
import {
  editProfilePrivilegesRoute, listSailCategoriesRoute,
} from '../../../routes/routes';
import { ProfileService } from '../../../services/profile.service';
import {
  fetchProfiles,
  fetchTotalProfileCount,
} from '../../../store/actions/profile.actions';
import { STORE_SLICES } from '../../../store/store';
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
  styleUrls: ['./admin-dashboard-page.component.css']
})
export class AdminDashboardPageComponent extends BasePageComponent implements OnInit, AfterViewInit {

  public createUserDialogRef: MatDialogRef<CreateUserDialogComponent>;
  public pendingApproval: Profile[];

  public dataSource = new MatTableDataSource<Profile>([]);
  public displayedColumns: string[] = ['photo', 'name', 'email', 'roles', 'created_at', 'last_login', 'status', 'action'];
  public displayedColumnsMobile: string[] = ['name'];
  public filterInfo: FilterInfo = { search: '', pagination: DEFAULT_PAGINATION, sort: 'name,ASC' };
  public paginatedData: PaginatedProfile;
  public profile_id: string;
  public profileStatus: ProfileStatus | 'ANY' = 'ANY';
  public profileStatusValues = { ...ProfileStatus, ANY: 'ANY' };

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

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES, () => {
      const profiles = this.profiles || {} as IProfileMap;
      const profile_ids = Object.keys(profiles);
      this.pendingApproval = profile_ids
        .filter(id => !!profiles[id])
        .filter(id => profiles[id].status === ProfileStatus.PendingApproval)
        .map(id => profiles[id]);
    });

    this.fetchPendingProfiles();
    this.dispatchAction(fetchTotalProfileCount());
    this.filterProfiles();
  }

  public get totalProfileCount(): number {
    return this.store.profiles.totalCount;
  }

  public fetchPendingProfiles(notify?: boolean): void {
    this.dispatchAction(fetchProfiles({ notify, query: `status=${ProfileStatus.PendingApproval}&sort=name,ASC` }));
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

  public goToSailCategories(): void {
    this.goTo([listSailCategoriesRoute]);
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
        { bio: { $contL: search } },
      ] });
    }

    if (this.profileStatus !== 'ANY') {
      query.$and.push({ status: this.profileStatus });
    }

    this.startLoading();

    const mediaFetch =  this.profileService.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, sort);
    this.paginatedData = await firstValueFrom(mediaFetch).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} profiles on page #${page.page}.`);
  }

  public filterHandler(event: FilterInfo): void {
    this.filterInfo = event;

    this.filterProfiles();
  }

}
