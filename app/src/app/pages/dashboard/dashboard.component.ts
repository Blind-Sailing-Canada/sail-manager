import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProfileRole } from '../../../../../api/src/types/profile/profile-role';
import { ProfileStatus } from '../../../../../api/src/types/profile/profile-status';
import { RequiredAction } from '../../../../../api/src/types/required-action/required-action';

import { Sail } from '../../../../../api/src/types/sail/sail';
import {
  RequiredActions,
  RequiredActionsState,
} from '../../models/required-actions.state';
import {
  adminRoute,
  boatsRoute,
  createSailRequestRoute,
  listChallengesRoute,
  listClinicsRoute,
  listDocumentsRoute,
  listMediaRoute,
  outstandingPurchasesRoute,
  sailRequestsRoute,
  sailsRoute,
  socialsRoute,
  viewRequiredActionRoute,
  viewSailRoute,
  viewUserSailsRoute,
} from '../../routes/routes';
import { dismissRequiredAction, fetchNewRequiredActionsForUser } from '../../store/actions/required-actions.actions';
import { STORE_SLICES } from '../../store/store';
import { BasePageComponent } from '../base-page/base-page.component';
import { fetchTodaySailsForAll } from '../../store/actions/today-sails.actions';
import { RequiredActionStatus } from '../../../../../api/src/types/required-action/required-action-status';
import { UserAccessFields } from '../../../../../api/src/types/user-access/user-access-fields';
import { SailPaymentClaim } from '../../../../../api/src/types/sail-payment-claim/sail-payment-claim';
import { SailPaymentClaimService } from '../../services/sail-payment-claim.service';
import { firstValueFrom } from 'rxjs';
import { SailService } from '../../services/sail.service';
import { UserSailsService } from '../../services/user-sails.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BasePageComponent implements OnInit {

  public ADMIN_ROUTE = adminRoute.toString();
  public BOATS_ROUTE = boatsRoute.toString();
  public SAILS_ROUTE = sailsRoute.toString();
  public SOCIALS_ROUTE = socialsRoute.toString();
  public MEDIA_ROUTE = listMediaRoute.toString();

  public SAIL_REQUESTS_ROUTE = sailRequestsRoute.toString();
  public createSailRequestRoute = createSailRequestRoute.toString();

  public allInProgressSails: Sail[] = [];
  public clinicsLink = listClinicsRoute;
  public documentsLink = listDocumentsRoute();
  public listChallengesLink = listChallengesRoute;
  public myInProgressSails: Sail[] = [];
  public myRequiredActions: RequiredAction[] = [];

  public allTodaySails: Sail[] = [];
  public myTodaySails: Sail[] = [];
  public myFutureSails: Sail[] = [];
  public myPastSails: Sail[] = [];

  public availableSails: Sail[] = [];
  public otherPastSails: Sail[] = [];

  public outstandingSailFees: SailPaymentClaim[];
  public outstandingPurchasesRoute = outstandingPurchasesRoute;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(Router) router: Router,
    @Inject(SailPaymentClaimService) private sailClaimService: SailPaymentClaimService,
    @Inject(SailService) private sailService: SailService,
    @Inject(UserSailsService) private userSailService: UserSailsService,
  ) {
    super(store, undefined, router);
  }

  async ngOnInit() {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.REQUIRED_ACTIONS, (requiredActionsState: RequiredActionsState) => {
      const actions: RequiredActions = requiredActionsState.actions || {};

      this.myRequiredActions = Object
        .values(actions)
        .filter(Boolean)
        .filter(action => action.assigned_to_id === this.user.profile.id && action.status === RequiredActionStatus.New);
    });

    this.fetchMyTodaySails();
    this.fetchAllTodaySails();
    this.fetchMyFutureSails();
    this.fetchMyInProgressSails();
    this.fetchAvailableSails();
    this.fetchMyPastSails();
    this.fetchOtherPastSails();

    if (this.shouldDisplayAllInProgressSails) {
      this.fetchAllInProgressSails();
    }

    this.fetchNewRequiredActionsForUser();
    this.fetchOutstandingSailFees();
  }

  get shouldDisplayAllInProgressSails(): boolean {
    const userType = this.user.roles.some(role => role === ProfileRole.Admin || role === ProfileRole.Coordinator);

    return userType && this.allInProgressSails.length > 0;
  }

  public gotToOutstandingSailFees(): void {
    this.goTo([outstandingPurchasesRoute(this.user.profile.id)]);
  }

  public gotToRequiredAction(requiredAction: RequiredAction): void {
    this.goTo([viewRequiredActionRoute(requiredAction.id)]);
  }

  public dismissRequiredAction(requiredAction: RequiredAction): void {
    this.dispatchAction(dismissRequiredAction({ action_id: requiredAction.id, notify: true }));
  }

  public fetchMyPastSails(): void {
    this.startLoading();

    const fetcher = this.userSailService.fetchPastSailsForUser(this.user.profile.id, 'limit=5');
    firstValueFrom(fetcher)
      .then(sails => this.myPastSails = sails)
      .finally(() => this.finishLoading());
  }

  public fetchOtherPastSails(notify = false): void {
    this.startLoading();

    const fetcher = this.userSailService.fetchPastSailsForAll('limit=5');
    firstValueFrom(fetcher)
      .then(sails => this.otherPastSails = sails)
      .finally(() => this.finishLoading());
  }

  public fetchMyFutureSails(notify = false): void {
    this.startLoading();

    const fetcher = this.userSailService.fetchFutureSailsForUser(this.user.profile.id, 'limit=5');
    firstValueFrom(fetcher)
      .then(sails => this.myFutureSails = sails)
      .finally(() => this.finishLoading());
  }

  public fetchMyTodaySails(notify = false): void {
    this.startLoading();

    const fetcher = this.userSailService.fetchTodaySailsForUser(this.user.profile.id, 'limit=5');
    firstValueFrom(fetcher)
      .then(sails => this.myTodaySails = sails)
      .finally(() => this.finishLoading());
  }

  public fetchAllTodaySails(notify = false): void {
    this.dispatchAction(fetchTodaySailsForAll({ notify }));
    this.startLoading();

    const fetcher = this.userSailService.fetchTodaySailsForAll('limit=5');
    firstValueFrom(fetcher)
      .then(sails => this.allTodaySails = sails)
      .finally(() => this.finishLoading());
  }

  public async fetchMyInProgressSails(notify = false) {
    this.startLoading();

    const fetcher = this.userSailService.fetchInProgressSailsForUser(this.user.profile.id, 'limit=5');
    firstValueFrom(fetcher)
      .then(sails => this.myInProgressSails = sails)
      .finally(() => this.finishLoading());
  }

  public fetchAllInProgressSails(notify = false): void {
    this.startLoading();

    const fetcher = this.userSailService.fetchInProgressSailsForAll('limit=5');
    firstValueFrom(fetcher)
      .then(sails => this.availableSails = sails)
      .finally(() => this.finishLoading());
  }

  public fetchAvailableSails(): void {
    this.startLoading();

    const fetcher = this.sailService.fetchAvailableSails('limit=5');
    firstValueFrom(fetcher)
      .then(sails => this.availableSails = sails)
      .finally(() => this.finishLoading());
  }

  public viewSail(sail) {
    this.goTo([viewSailRoute(sail.id)], {});
  }

  public get shouldShowSailsControls(): boolean {
    return this.user.roles.includes(ProfileRole.Admin)
    || this.user.roles.includes(ProfileRole.Coordinator)
    || this.user.roles.includes(ProfileRole.FleetManager)
    || !!this.user.access[UserAccessFields.CreateSail]
    || !!this.user.access[UserAccessFields.EditSail];
  }

  public get shouldShowSailRequestsControls(): boolean {
    if (!this.user) {
      return false;
    }

    const should = this.user.profile.status === ProfileStatus.Approved;

    return should;
  }

  public get shouldShowAdminControls(): boolean {
    if (!this.user) {
      return false;
    }

    const userRoles: string[] = this.user.profile.roles || [];
    const should = userRoles.some(role => role === ProfileRole.Admin);

    return should;
  }

  public viewUserSailsRouteLink(profile_id: string): string {
    return viewUserSailsRoute(profile_id);
  }

  private fetchNewRequiredActionsForUser(): void {
    this.dispatchAction(fetchNewRequiredActionsForUser({ user_id: this.user.profile.id }));
  }

  private async fetchOutstandingSailFees() {
    this.startLoading();

    const query = { product_purchase_id: null, profile_id: this.user.profile.id };

    this.outstandingSailFees = await firstValueFrom(this.sailClaimService.fetchAllPaginated(query))
      .then((results) => results.data)
      .finally(() => this.finishLoading());
  }
}
