import { of } from 'rxjs';
import {
  catchError,
  concatMap,
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
import { RequiredActionsService } from '../../services/required-actions.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  startLoading,
} from '../actions/app.actions';
import {
  completeRequiredAction,
  dismissRequiredAction,
  fetchNewRequiredActionsForUser,
  putRequiredAction,
  putRequiredActions,
} from '../actions/required-actions.actions';
import { putSnack } from '../actions/snack.actions';

@Injectable()
export class RequiredActionsEffects {

  fetchNewRequiredActionsForUser$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchNewRequiredActionsForUser),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.service.fetchNewRequiredActionsForUser(action.userId)
          .pipe(
            concatMap(returnedActions => of(putRequiredActions({ actions: returnedActions }))),
            catchError(errorCatcher(`Failed to fetch required actions for user ${action.userId}.`))
          )
      ),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  completeRequiredActionsForUser$ = createEffect(
    () => this.actions$.pipe(
      ofType(completeRequiredAction),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.service.completeRequiredAction(action.action_id)
          .pipe(
            concatMap(returnedAction => of(
              action.notify && putSnack({ snack: { message: 'Action completed', type: SnackType.INFO } }),
              putRequiredAction({ action_id: action.action_id, action: returnedAction }),
            )),
            catchError(errorCatcher(`Failed to complete required actions ${action.action_id}.`))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  dismissRequiredActionsForUser$ = createEffect(
    () => this.actions$.pipe(
      ofType(dismissRequiredAction),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.service.dismissRequiredAction(action.action_id)
          .pipe(
            concatMap(returnedAction => of(
              action.notify && putSnack({ snack: { message: 'Action dismissed', type: SnackType.INFO } }),
              putRequiredAction({ action_id: action.action_id, action: returnedAction }),
            )),
            catchError(errorCatcher(`Failed to dismiss required actions ${action.action_id}.`))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(RequiredActionsService) private service: RequiredActionsService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
