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
  sailRequestsRoute,
  sailsRoute,
  viewRequiredActionRoute,
  viewSailRoute,
  viewUserSailsRoute,
} from '../../routes/routes';
import {
  fetchInProgressSailsForAll,
  fetchInProgressSailsForUser,
} from '../../store/actions/in-progress-sails.actions';
import {
  fetchPastSailsForAll,
  fetchPastSailsForUser,
} from '../../store/actions/past-sails.actions';
import { fetchNewRequiredActionsForUser } from '../../store/actions/required-actions.actions';
import {
  fetchFutureSailsForAll,
  fetchFutureSailsForUser,
} from '../../store/actions/future-sails.actions';
import { STORE_SLICES } from '../../store/store';
import { BasePageComponent } from '../base-page/base-page.component';
import { FutureSailsState } from '../../models/future-sails-state.interface';
import { PastSailsState } from '../../models/past-sails-state.interface';
import { InProgressSailsState } from '../../models/in-progress-sails-state';
import { TodaySailsState } from '../../models/today-sails-state.interface';
import { fetchTodaySailsForAll, fetchTodaySailsForUser } from '../../store/actions/today-sails.actions';
import { RequiredActionStatus } from '../../../../../api/src/types/required-action/required-action-status';
import { UserAccessFields } from '../../../../../api/src/types/user-access/user-access-fields';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends BasePageComponent implements OnInit {

  public ADMIN_ROUTE = adminRoute.toString();
  public BOATS_ROUTE = boatsRoute.toString();
  public SAILS_ROUTE = sailsRoute.toString();

  public SAIL_REQUESTS_ROUTE = sailRequestsRoute.toString();
  public createSailRequestRoute = createSailRequestRoute.toString();

  public allInProgressSails: Sail[] = [];
  public allPastSails: Sail[] = [];
  public clinicsLink = listClinicsRoute;
  public listChallengesLink = listChallengesRoute;
  public myInProgressSails: Sail[] = [];
  public myRequiredActions: RequiredAction[] = [];

  public allTodaySails: Sail[] = [];
  public myTodaySails: Sail[] = [];
  public myFutureSails: Sail[] = [];
  public myPastSails: Sail[] = [];

  public availableSails: Sail[] = [];
  public otherPastSails: Sail[] = [];

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(Router) router: Router,
  ) {
    super(store, undefined, router);
  }

  async ngOnInit() {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.REQUIRED_ACTIONS, (requiredActionsState: RequiredActionsState) => {
      const actions: RequiredActions = requiredActionsState.actions || {};

      this.myRequiredActions = Object
        .values(actions)
        .filter(Boolean)
        .filter(action => action.assignedToId === this.user.profile.id && action.status === RequiredActionStatus.New);
    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.FUTURE_SAILS, (sails: FutureSailsState) => {
      this.availableSails = sails.all || [];
      this.myFutureSails = sails[this.user.profile.id] || [];
    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PAST_SAILS, (sails: PastSailsState) => {
      this.allPastSails = sails.all || [];
      this.myPastSails = sails[this.user.profile.id] || [];
    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.IN_PROGRESS_SAILS, (sails: InProgressSailsState) => {
      this.allPastSails = sails.all || [];
      this.myPastSails = sails[this.user.profile.id] || [];
    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.TODAY_SAILS, (sails: TodaySailsState) => {
      this.allTodaySails = sails.all || [];
      this.myTodaySails = sails[this.user.profile.id] || [];
    });

    this.fetchMyTodaySails();
    this.fetchAllTodaySails();
    this.fetchMyFutureSails();
    this.fetchMyInProgressSails();

    if (this.shouldDisplayAllInProgressSails) {
      this.fetchAllInProgressSails();
    }

    this.fetchAvailableSails();
    this.fetchMyPastSails();
    this.fetchOtherPastSails();
    this.fetchNewRequiredActionsForUser();
  }

  get shouldDisplayAllInProgressSails(): boolean {
    const userType = this.user.roles.some(role => role === ProfileRole.Admin || role === ProfileRole.Coordinator);

    return userType && this.allInProgressSails.length > 0;
  }

  public gotToRequiredAction(requiredAction: RequiredAction): void {
    this.goTo([viewRequiredActionRoute(requiredAction.id)]);
  }

  private fetchNewRequiredActionsForUser(): void {
    this.dispatchAction(fetchNewRequiredActionsForUser({ userId: this.user.profile.id }));
  }

  public fetchMyPastSails(notify = false): void {
    this.dispatchAction(fetchPastSailsForUser({ notify, profileId: this.user.profile.id, query: 'limit=10' }));
  }

  public fetchOtherPastSails(notify = false): void {
    this.dispatchAction(fetchPastSailsForAll({ notify, query: 'limit=10' }));
  }

  public fetchMyFutureSails(notify = false): void {
    this.dispatchAction(fetchFutureSailsForUser({ notify, profileId: this.user.profile.id, query: 'limit=10' }));
  }

  public fetchMyTodaySails(notify = false): void {
    this.dispatchAction(fetchTodaySailsForUser({ notify, profileId: this.user.profile.id, query: 'limit=10' }));
  }

  public fetchAllTodaySails(notify = false): void {
    this.dispatchAction(fetchTodaySailsForAll({ notify }));
  }
  public async fetchMyInProgressSails(notify = false) {
    this.dispatchAction(fetchInProgressSailsForUser({ notify, id: this.user.profile.id }));
  }

  public fetchAllInProgressSails(notify = false): void {
    this.dispatchAction(fetchInProgressSailsForAll({ notify }));
  }

  public fetchAvailableSails(notify = false): void {
    this.dispatchAction(fetchFutureSailsForAll({ notify, query: 'limit=10' }));
  }

  public viewSail(sail) {
    this.goTo([viewSailRoute(sail.id)], {});
  }

  public get shouldShowSailsControls(): boolean {
    return !!this.user.access[UserAccessFields.CreateSail] || !!this.user.access[UserAccessFields.EditSail];
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

  public get shouldShowBoatsControls(): boolean {
    return !!this.user.access[UserAccessFields.EditBoat] || !!this.user.access[UserAccessFields.CreateBoat];
  }

  public viewUserSailsRouteLink(profileId: string): string {
    return viewUserSailsRoute(profileId);
  }
}
