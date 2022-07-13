import { of } from 'rxjs';
import {
  catchError,
  filter,
  mergeMap,
  tap,
} from 'rxjs/operators';
import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SnackType } from '../../models/snack-state.interface';
import { SailService } from '../../services/sail.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  startLoading,
} from '../actions/app.actions';
import { putSnack } from '../actions/snack.actions';
import {
  fetchFutureSailsForAll,
  fetchFutureSailsForUser,
  putFutureSailsForAll,
  putFutureSailsForUser
} from '../actions/future-sails.actions';
import { UserSailsService } from '../../services/user-sails.service';

@Injectable()
export class FutureSailsEffects {

  fetchAvailableSails$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchFutureSailsForAll),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.fetchAvailableSails(action.query)
          .pipe(
            mergeMap(sails => of(
              putFutureSailsForAll({ sails }),
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'refreshed' } }),
            )),
            catchError(errorCatcher('Failed to get upcoming sails.'))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  fetchFutureSailsForUser$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchFutureSailsForUser),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.userSailService.fetchFutureSailsForUser(action.profile_id, action.query)
          .pipe(
            mergeMap(sails => of(
              putFutureSailsForUser({ sails, profile_id: action.profile_id }),
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'refreshed' } }),
            )),
            catchError(errorCatcher('Failed to get your upcoming sails.'))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(SailService) private sailService: SailService,
    @Inject(UserSailsService) private userSailService: UserSailsService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
