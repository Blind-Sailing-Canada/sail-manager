import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog/dialog-ref';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { Profile } from '../../../../../../api/src/types/profile/profile';
import { ProfileLink } from '../../../../../../api/src/types/user/profile-link';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';
import { LinkAccountsDialogComponent } from '../../../components/link-accounts-dialog/link-accounts-dialog.component';
import { LinkAccountsDialogData } from '../../../models/link-accounts-dialog-data.interface';

import {
  editProfilePrivilegesRoute,
  editProfileRoute,
  viewClinicRoute,
  viewUserSailsRoute,
} from '../../../routes/routes';
import { ProfileService } from '../../../services/profile.service';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

export enum EDIT_ACTIONS {
  UPDATE_INFO = 'update info',
  UPDATE_ACCESS = 'update access'
}

@Component({
  selector: 'app-profile-view-page',
  templateUrl: './profile-view-page.component.html',
  styleUrls: ['./profile-view-page.component.css']
})
export class ProfileViewPageComponent extends BasePageComponent implements OnInit {
  public captionActions = [
    {
      name: EDIT_ACTIONS.UPDATE_INFO,
      icon: 'edit',
      tooltip: EDIT_ACTIONS.UPDATE_INFO,
    },
    {
      name: EDIT_ACTIONS.UPDATE_ACCESS,
      icon: 'security',
      tooltip: EDIT_ACTIONS.UPDATE_ACCESS,
    }
  ];

  public linkAccountsDialogRef: MatDialogRef<LinkAccountsDialogComponent>;

  constructor(
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(ProfileService) private profileService: ProfileService,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit(): void {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
  }

  public get canLinkAccounts(): boolean {
    return this.user.access[UserAccessFields.LinkAccounts];
  }

  public get canViewSails(): boolean {
    return this.user.profile.id === this.profileId || this.user.access[UserAccessFields.ViewUserSails];
  }

  public get profileId(): string {
    return this.route.snapshot.params.id;
  }

  public get profile(): Profile {
    return this.getProfile(this.profileId);
  }

  public get canEditPrivileges(): boolean {
    const can = this.user.access[UserAccessFields.EditUserAccess];

    return !!can;
  }

  public get canEditInfo(): boolean {
    const can = this.user.profile.id === this.profileId || this.user.access[UserAccessFields.EditUserProfile];

    return !!can;
  }

  public actionsClicked(event): void {
    switch (event) {
      case EDIT_ACTIONS.UPDATE_INFO:
        this.goTo([this.editProfileInfoLink(this.profileId)]);
        break;
      case EDIT_ACTIONS.UPDATE_ACCESS:
        this.goTo([this.editProfilePrivilegesLink(this.profileId)]);
        break;
    }
  }

  public editProfileInfoLink(profileId: string): string {
    return editProfileRoute(profileId);
  }

  public editProfilePrivilegesLink(profileId: string): string {
    return editProfilePrivilegesRoute(profileId);
  }

  public viewUserSailsRouteLink(profileId: string): string {
    return viewUserSailsRoute(profileId);
  }

  public goToClinic(clinicId: string): void {
    this.goTo([viewClinicRoute(clinicId)]);
  }

  public linkAccounts(profileA: Profile, profileB: Profile, linkType: ProfileLink): void {
    this.profileService.linkAccounts({
      linkType,
      profileIdA: profileA.id,
      profileIdB: profileB.id,
    }).toPromise()
    .then(() => this.dispatchMessage('Linked'))
    .catch((error) => {
      console.error(error);
      this.dispatchError('Failed to link accounts.');
    });
  }

  public openLinkAccountsDialog(): void {
    const dialogData: LinkAccountsDialogData = {
      linkAccounts: (profileA: Profile, profileB: Profile, linkType: ProfileLink) => this.linkAccounts(profileA, profileB, linkType),
      account: this.profile,
      accounts: [],
      fetchAccounts: (nameOrEmail: string) => this.fetchAccounts(nameOrEmail),
    };

    this.linkAccountsDialogRef = this.dialog
      .open(LinkAccountsDialogComponent, {
        width: '90%',
        maxWidth: 500,
        data: dialogData,
      });
  }

  public fetchAccounts(nameOrEmail: string): void {
    this.profileService
      .fetchProfiles(`s={"$or" : [{"name": {"$cont": "${nameOrEmail}"}}, {"email": {"$cont": "${nameOrEmail}"}}]}`)
      .pipe(takeWhile(() => this.active))
      .subscribe((accounts) => {
        if (this.linkAccountsDialogRef && this.linkAccountsDialogRef.componentInstance) {
          this.linkAccountsDialogRef.componentInstance.data = {
            ...this.linkAccountsDialogRef.componentInstance.data,
            accounts: accounts.filter(account => account.id !== this.profile.id),
          };
        }
      });
  }
}
