import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { MatDialog } from '@angular/material/dialog';
import { WindowService } from '../../../services/window.service';
import { AdminService } from '../../../services/admin.service';
import { Observable, delay, firstValueFrom, of, switchMap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { GroupMember, PaginatedGroupMember } from '../../../../../../api/src/types/group/group-member';
import { FilterInfo } from '../../../models/filter-into';
import { DEFAULT_PAGINATION } from '../../../models/default-pagination';
import { AddGroupMemberDialogData } from '../../../models/add-group-member-dialog-data';
import { AddGroupMemberDialogComponent } from '../../../components/add-group-member-dialog/add-group-member-dialog.component';


@Component({
  selector: 'app-admin-group-members-page',
  templateUrl: './admin-group-members-page.component.html',
  styleUrls: ['./admin-group-members-page.component.scss']
})
export class AdminGroupMembersPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
  public groupName: string;
  public paginatedData: PaginatedGroupMember;
  private data: GroupMember[] = [];
  public dataSource = new MatTableDataSource<GroupMember>([]);
  public displayedColumns: string[] = ['email', 'role', 'profile', 'roles', 'action'];
  public filterInfo: FilterInfo = { search: '', pagination: DEFAULT_PAGINATION, sort: 'email,ASC' };

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(Router) router: Router,
    @Inject(ActivatedRoute) activeRoute: ActivatedRoute,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(WindowService) public windowService: WindowService,
    @Inject(AdminService) private adminService: AdminService
  ) {
    super(store, activeRoute, router, dialog);
    this.groupName = this.route.snapshot.paramMap.get('groupName');
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }
    this.groupName = this.route.snapshot.paramMap.get('groupName');
    this.fetchGroupMembers(false);
  }

  public async fetchGroupMembers(withDelay = false) {
    let fetcher:  Observable<GroupMember[]> = null;
    switch(this.groupName) {
      case 'Crew':
        fetcher =  this.adminService.listCrewGroupMembers();
        break;
      case 'Skippers':
        fetcher =  this.adminService.listSkipperGroupMembers();
        break;
      case 'Members':
        fetcher =  this.adminService.listMemberGroupMembers();
        break;
      default:
        this.dispatchError(`Unknown group ${this.groupName}`);
        return;
    }


    const delayedFetcher = of({}).pipe(delay(withDelay ? 2000: 0), switchMap(() => fetcher));
    this.startLoading();
    try {
      const data = await firstValueFrom(delayedFetcher).finally(() => this.finishLoading());
      this.paginatedData = {
        data,
        count: data.length,
        total: data.length,
        page: 0,
        pageCount: 1
      };
      this.data = data;
      this.dataSource.data = data;
      this.filterInfo.pagination.pageSize = data.length;

      this.dispatchMessage(`Displaying ${data.length} members of ${this.groupName} group.`);
    } catch (error) {
      console.log(error);
      this.dispatchError(error.error?.message || error.message || 'Failed to fetch members.');
      this.finishLoading();
    }

  }

  public filterHandler(event: FilterInfo): void {
    const [sortField, sortDirection] = event.sort.split(',');
    const filteredData = this.data
      .filter((member) => member.member.email
        .includes(event.search)
          || member.profile?.email.includes(event.search)
          || member.profile?.name.includes(event.search));

    const sortedData = filteredData.sort((a, b) => {
      if (sortField === 'email') {
        if (sortDirection === 'DESC') {
          return b.member.email.localeCompare(a.member.email);
        } else {
          return a.member.email.localeCompare(b.member.email);
        }
      } else if (sortField === 'profile') {
        if (sortDirection === 'DESC') {
          return b.profile?.name.localeCompare(a.profile?.name);
        } else {
          return a.profile?.name.localeCompare(b.profile?.name);
        }
      }
      return 0;
    });

    this.dataSource.data = sortedData;
    this.paginatedData.data = sortedData;
  }

  public async deleteMember(email: string) {
    let fetcher = null;

    switch(this.groupName) {
      case 'Crew':
        fetcher =  this.adminService.deleteCrewGroupMember(email);
        break;
      case 'Skippers':
        fetcher =  this.adminService.deleteSkipperGroupMember(email);
        break;
      case 'Members':
        fetcher =  this.adminService.deleteMemberGroupMember(email);
        break;
      default:
        this.dispatchError(`Unknown group ${this.groupName}`);
        return;
    }

    this.startLoading();
    try {
      await firstValueFrom(fetcher).finally(() => this.finishLoading());
      this.dispatchMessage(`Removed ${email} member from ${this.groupName} group.`);
      this.fetchGroupMembers(true);
    } catch(error) {
      this.dispatchError(error.error?.message || error.message || 'Failed to remove member.');
      this.finishLoading();
    }
  }

  private async addGroupMember(memberEmail: string) {
    let fetcher = null;
    switch(this.groupName) {
      case 'Crew':
        fetcher =  this.adminService.addCrewGroupMember(memberEmail);
        break;
      case 'Skippers':
        fetcher =  this.adminService.addSkipperGroupMember(memberEmail);
        break;
      case 'Members':
        fetcher =  this.adminService.addMemberGroupMember(memberEmail);
        break;
      default:
        this.dispatchError(`Unknown group ${this.groupName}`);
        return;
    }

    this.startLoading();
    try {
      await firstValueFrom(fetcher).finally(() => this.finishLoading());
      this.dispatchMessage(`Added ${memberEmail} member to ${this.groupName} group.`);
      this.fetchGroupMembers(true);
    } catch(error) {
      this.dispatchError(error.error?.message || error.message || 'Failed to add member.');
      this.finishLoading();
    }
  }

  public showAddMemberDialog(): void {
    const dialogData: AddGroupMemberDialogData = {
      addMember: (_, memberEmail) => this.addGroupMember(memberEmail),
      group: this.groupName,
      memberEmail: '',
    };

    this.dialog
      .open(AddGroupMemberDialogComponent, {
        width: '90%',
        maxWidth: 500,
        data: dialogData,
      });
  }

}
