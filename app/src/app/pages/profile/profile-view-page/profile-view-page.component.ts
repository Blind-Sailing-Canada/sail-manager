import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
  listPurchasesRoute,
  outstandingPurchasesRoute,
  viewClinicRoute,
  viewUserSailsRoute,
} from '../../../routes/routes';
import { ProfileService } from '../../../services/profile.service';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { FormResponseService } from '../../../services/form-response.service';
import { firstValueFrom } from 'rxjs';
import { FormResponse } from '../../../../../../api/src/types/form-response/form-response';
import { ProfileRole } from '../../../../../../api/src/types/profile/profile-role';

@Component({
  selector: 'app-profile-view-page',
  templateUrl: './profile-view-page.component.html',
  styleUrls: ['./profile-view-page.component.scss']
})
export class ProfileViewPageComponent extends BasePageComponent implements OnInit {
  public formResponses: FormResponse[] = [];
  public linkAccountsDialogRef: MatDialogRef<LinkAccountsDialogComponent>;
  public outstandingPurchasesRoute = outstandingPurchasesRoute;

  constructor(
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(ProfileService) private profileService: ProfileService,
    @Inject(FormResponseService) private formResponseService: FormResponseService,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit(): void {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.fetchFormResponses();
  }

  private async fetchFormResponses() {
    if (!this.profile_id) {
      return;
    }

    if (
      this.user.profile.id !== this.profile_id
      && !this.user.roles.includes(ProfileRole.Admin)
      && !this.user.roles.includes(ProfileRole.Coordinator)
    ) {
      return;
    }

    this.startLoading();

    const fetcher = this.formResponseService.fetchForProfile(this.profile_id);
    this.formResponses = await firstValueFrom(fetcher).finally(() => this.finishLoading());
  }

  public get canLinkAccounts(): boolean {
    return this.user.access[UserAccessFields.LinkAccounts];
  }

  public get canViewSails(): boolean {
    return this.user.profile.id === this.profile_id || this.user.access[UserAccessFields.ViewUserSails];
  }

  public get canViewPurchases(): boolean {
    return this.user.profile.id === this.profile_id || this.user.roles.includes(ProfileRole.Admin);
  }

  public get profile_id(): string {
    return this.route.snapshot.params.id;
  }

  public get profile(): Profile {
    return this.getProfile(this.profile_id);
  }

  public get canEditPrivileges(): boolean {
    const can = this.user.access[UserAccessFields.EditUserAccess];

    return !!can;
  }

  public get canEditInfo(): boolean {
    const can = this.user.profile.id === this.profile_id || this.user.access[UserAccessFields.EditUserProfile];

    return !!can;
  }

  public get canViewOutstandingPurchases(): boolean {
    return this.profile_id === this.user.profile.id || this.user.roles.includes(ProfileRole.Admin);
  }

  public editProfileInfoLink(profile_id: string): string {
    return editProfileRoute(profile_id);
  }

  public editProfilePrivilegesLink(profile_id: string): string {
    return editProfilePrivilegesRoute(profile_id);
  }

  public viewUserSailsRouteLink(profile_id: string): string {
    return viewUserSailsRoute(profile_id);
  }

  public viewUserPurchasesRouteLink(): string {
    return listPurchasesRoute();
  }

  public goToClinic(clinic_id: string): void {
    this.goTo([viewClinicRoute(clinic_id)]);
  }

  public linkAccounts(profileA: Profile, profileB: Profile, linkType: ProfileLink): void {
    this.profileService.linkAccounts({
      linkType,
      profile_idA: profileA.id,
      profile_idB: profileB.id,
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
      .fetchProfiles(`s={"$or" : [{"name": {"$contL": "${nameOrEmail}"}}, {"email": {"$cont": "${nameOrEmail}"}}]}`)
      .pipe(takeWhile(() => this.active))
      .subscribe((accounts) => {
        if (this.linkAccountsDialogRef && this.linkAccountsDialogRef.componentInstance) {
          this.linkAccountsDialogRef.componentInstance.data = {
            ...this.linkAccountsDialogRef.componentInstance.data,
            accounts: accounts.data.filter(account => account.id !== this.profile.id),
          };
        }
      });
  }
}
