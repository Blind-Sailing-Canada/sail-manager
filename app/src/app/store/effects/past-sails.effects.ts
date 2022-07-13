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
import { UserSailsService } from '../../services/user-sails.service';

@Injectable()
export class PastSailsEffects {

  fetchPastSailsForAll$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchPastSailsForAll),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.userSailService.fetchPastSailsForAll(action.query)
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
        action => this.userSailService.fetchPastSailsForUser(action.profile_id, action.query)
          .pipe(
            mergeMap((sails) => {
              if (action.notify) {
                return of(
                  putPastSailsForUser({ sails, profile_id: action.profile_id }),
                  putSnack({ snack: { type: SnackType.INFO, message: 'Refreshed' } }),
                );
              }
              return of(putPastSailsForUser({ sails, profile_id: action.profile_id }));
            }),
            catchError(errorCatcher('Failed to get your past sails.'))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(UserSailsService) private userSailService: UserSailsService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
