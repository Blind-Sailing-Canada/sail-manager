import { of } from 'rxjs';
import {
  catchError,
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
import { fetchTodaySailsForAll, fetchTodaySailsForUser, putTodaySailsForAll, putTodaySailsForUser } from '../actions/today-sails.actions';

@Injectable()
export class TodaySailsEffects {

  fetchTodaySailsForAll$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchTodaySailsForAll),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.fetchTodaySailsForAll(action.query)
          .pipe(
            mergeMap((sails) => {
              if (action.notify) {
                return of(
                  putTodaySailsForAll({ sails }),
                  putSnack({ snack: { type: SnackType.INFO, message: 'Refreshed' } }),
                );
              }
              return of(putTodaySailsForAll({ sails }));
            }),
            catchError(errorCatcher("Failed to get today's sails."))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  fetchTodaySailsForUser$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchTodaySailsForUser),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.fetchTodaySailsForUser(action.profileId, action.query)
          .pipe(
            mergeMap((sails) => {
              if (action.notify) {
                return of(
                  putTodaySailsForUser({ sails, profileId: action.profileId }),
                  putSnack({ snack: { type: SnackType.INFO, message: 'Refreshed' } }),
                );
              }
              return of(putTodaySailsForUser({ sails, profileId: action.profileId }));
            }),
            catchError(errorCatcher("Failed to get your today's sails."))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(SailService) private sailService: SailService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
