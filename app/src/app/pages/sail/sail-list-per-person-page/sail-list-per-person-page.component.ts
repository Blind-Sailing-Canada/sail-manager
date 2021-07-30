import { take } from 'rxjs/operators';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';

import { SnackType } from '../../../models/snack-state.interface';
import { createSailRequestRoute, sailRequestsRoute, viewSailRoute } from '../../../routes/routes';
import { SailService } from '../../../services/sail.service';
import { putSnack } from '../../../store/actions/snack.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { Sail } from '../../../../../../api/src/types/sail/sail';
import { Profile } from '../../../../../../api/src/types/profile/profile';

@Component({
  selector: 'app-sail-list-per-person-page',
  templateUrl: './sail-list-per-person-page.component.html',
  styleUrls: ['./sail-list-per-person-page.component.css']
})
export class SailListPerPersonPageComponent extends BasePageComponent implements OnInit {

  public currentCount = 0;
  public createSailRequestRoute = createSailRequestRoute.toString();
  public listSailRequestRoute = sailRequestsRoute.toString();
  public fetching = false;
  public paginationSize = 10;
  public profile: Profile;
  public profile_id: string;
  public profileSails: Sail[] = [];
  public totalCount = 0;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(SailService) private sailService: SailService,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    this.profile_id = this.route.snapshot.params.profile_id;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES, () => {
      this.profile = this.getProfile(this.profile_id);
    });

    this.getLatestSails();
  }

  public getLatestSails(): void {
    this.fetching = true;

    const queryString = `limit=${this.paginationSize}&sort=start,DESC`;

    this.sailService
      .fetchUserSail(this.profile_id, queryString)
      .pipe(take(1))
      .subscribe((sails) => {
        this.profileSails = sails;
        this.currentCount = sails.length;
        this.totalCount = sails.length;
        this.fetching = false;
        this.dispatchAction(putSnack({ snack: { message: `Fetched ${sails.length} sails`, type: SnackType.INFO } }));
      });
  }

  public goToSail(sail: Sail): void {
    this.goTo([viewSailRoute(sail.id)]);
  }

}
