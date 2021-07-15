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
import {
  fetchInProgressSailsForAll,
  fetchInProgressSailsForUser,
  putInProgressSailsForAll,
  putInProgressSailsForUser,
} from '../actions/in-progress-sails.actions';
import { putSnack } from '../actions/snack.actions';

@Injectable()
export class InProgressSailsEffects {

  fetchInProgressSailsForAll$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchInProgressSailsForAll),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.fetchInProgressSailsForAll(action.query)
          .pipe(
            mergeMap(sails => of(
              putInProgressSailsForAll({ sails }),
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'refreshed' } }),
            )),
            catchError(errorCatcher('Failed to get in-progress sails.'))
          )
      ),
      tap(() => this.store.dispatch(finishLoading())),
      filter(action => action && action.type),
    )
  );

  fetchInProgressSailsForUser$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchInProgressSailsForUser),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.fetchInProgressSailsForUser(action.id, action.query)
          .pipe(
            mergeMap(sails => of(
              putInProgressSailsForUser({ sails, profileId: action.id }),
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'refreshed' } }),
            )),
            catchError(errorCatcher('Failed to get your in-progress sails.'))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(SailService) private sailService: SailService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
