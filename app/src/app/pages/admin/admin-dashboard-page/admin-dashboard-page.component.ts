import {
  fromEvent,
  of,
} from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  switchMap,
  takeWhile,
} from 'rxjs/operators';
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IProfileMap } from '../../../models/profile-state.interface';
import { SnackType } from '../../../models/snack-state.interface';
import {
  editProfilePrivilegesRoute,
} from '../../../routes/routes';
import { ProfileService } from '../../../services/profile.service';
import {
  fetchProfiles,
  fetchTotalProfileCount,
  putProfiles,
} from '../../../store/actions/profile.actions';
import { putSnack } from '../../../store/actions/snack.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { Profile } from '../../../../../../api/src/types/profile/profile';
import { ProfileStatus } from '../../../../../../api/src/types/profile/profile-status';

@Component({
  selector: 'app-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.component.html',
  styleUrls: ['./admin-dashboard-page.component.css']
})
export class AdminDashboardPageComponent extends BasePageComponent implements OnInit, AfterViewInit {

  public searchedProfiles: Profile[];
  @ViewChild('profileSearchInput', { static: false }) private profileSearchInput;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ProfileService) private profileService: ProfileService,
    @Inject(Router) router: Router,
  ) {
    super(store, undefined, router);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES, () => {
      if (!this.searchedProfiles) {
        this.searchedProfiles = this.profilesArray;
      }
    });

    this.fetchPendingProfiles();
    this.dispatchAction(fetchTotalProfileCount());
  }

  ngAfterViewInit(): void {
    const typeahead = fromEvent(this.profileSearchInput.nativeElement, 'input')
      .pipe(
        takeWhile(() => this.active),
        map((e: any) => (e.target.value || '') as string),
        debounceTime(1000),
        map(text => text ? text.trim() : ''),
        filter(text => !text || text.length > 2),
        switchMap((text) => {
          if (!text) {
            return of(this.profilesArray);
          }

          return this.profileService.searchByNameOrEmail(text);
        }),
      );

    typeahead
      .subscribe((profiles) => {
        this.dispatchAction(
          putSnack({ snack: { type: SnackType.INFO, message: `Found ${profiles.length} users.` } })
        );
        this.searchedProfiles = profiles;
        this.dispatchAction(putProfiles({ profiles }));
      });

    super.ngAfterViewInit();
  }

  public fetchAllUsers(): void {
    this.searchedProfiles = null;
    this.profileSearchInput.nativeElement.value = '';
    this.dispatchAction(fetchProfiles({ query: '', notify: true }));
  }

  public get pendingApproval(): Profile[] {
    const profiles = this.profiles || {} as IProfileMap;
    const profileIds = Object.keys(profiles);
    const pendingProfiles = profileIds
      .filter(id => !!profiles[id])
      .filter(id => profiles[id].status === ProfileStatus.PendingApproval)
      .map(id => profiles[id]);

    return pendingProfiles;
  }

  public get totalProfileCount(): number {
    return this.store.profiles.totalCount;
  }

  public fetchPendingProfiles(notify?: boolean): void {
    this.dispatchAction(fetchProfiles({ notify, query: `status=${ProfileStatus.PendingApproval}` }));
  }

  public editProfilePrivileges(profile: Profile): void {
    this.goTo([editProfilePrivilegesRoute(profile.id)]);
  }

}
