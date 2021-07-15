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
import {
  fetchPastSailsForAll,
  fetchPastSailsForUser,
  putPastSailsForAll,
  putPastSailsForUser,
} from '../actions/past-sails.actions';
import { putSnack } from '../actions/snack.actions';

@Injectable()
export class PastSailsEffects {

  fetchPastSailsForAll$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchPastSailsForAll),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.fetchPastSailsForAll(action.query)
          .pipe(
            mergeMap((sails) => {
              if (action.notify) {
                return of(
                  putPastSailsForAll({ sails }),
                  putSnack({ snack: { type: SnackType.INFO, message: 'Refreshed' } }),
                );
              }
              return of(putPastSailsForAll({ sails }));
            }),
            catchError(errorCatcher('Failed to get past sails.'))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  fetchPastSailsForUser$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchPastSailsForUser),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.fetchPastSailsForUser(action.profileId, action.query)
          .pipe(
            mergeMap((sails) => {
              if (action.notify) {
                return of(
                  putPastSailsForUser({ sails, profileId: action.profileId }),
                  putSnack({ snack: { type: SnackType.INFO, message: 'Refreshed' } }),
                );
              }
              return of(putPastSailsForUser({ sails, profileId: action.profileId }));
            }),
            catchError(errorCatcher('Failed to get your past sails.'))
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
