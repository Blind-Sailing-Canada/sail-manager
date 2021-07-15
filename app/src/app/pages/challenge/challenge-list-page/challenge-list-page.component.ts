import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Challenge } from '../../../../../../api/src/types/challenge/challenge';
import { ChallengeStatus } from '../../../../../../api/src/types/challenge/challenge-status';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';
import {
  createChallengeRoute,
  viewChallengeRoute,
} from '../../../routes/routes';
import { WindowService } from '../../../services/window.service';
import { fetchChallenges } from '../../../store/actions/challenge.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-challenge-list-page',
  templateUrl: './challenge-list-page.component.html',
  styleUrls: ['./challenge-list-page.component.css']
})
export class ChallengeListPageComponent extends BasePageComponent implements OnInit {

  public activeChallenges: Challenge[] = [];
  public newChallenges: Challenge[] = [];
  public completedChallenges: Challenge[] = [];
  public createChallengeLink = createChallengeRoute.toString();

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(WindowService) public windowServer: WindowService,
  ) {
    super(store, undefined, router, dialog);
  }

  ngOnInit() {

    if (!this.user) {
      return;
    }

    this.subscribeToStoreSliceWithUser(STORE_SLICES.CHALLENGES, () => {
      const challenges = this.store[STORE_SLICES.CHALLENGES];

      this.activeChallenges = Object
        .keys(challenges)
        .map(key => challenges[key])
        .filter(challenge => challenge.status === ChallengeStatus.Active);

      this.newChallenges = Object
        .keys(challenges)
        .map(key => challenges[key])
        .filter(challenge => challenge.status === ChallengeStatus.New);

      this.completedChallenges = Object
        .keys(challenges)
        .map(key => challenges[key])
        .filter(challenge => challenge.status === ChallengeStatus.Finished);
    });

    this.dispatchAction(fetchChallenges({ notify: false }));
  }

  public viewChallenge(challengeId: string): void {
    this.goTo([viewChallengeRoute(challengeId)]);
  }

  public get canCreateNewChallenge(): boolean {
    return !!this.user.access[UserAccessFields.CreateChallenge];
  }

}
