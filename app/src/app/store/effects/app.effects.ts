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
import { Router } from '@angular/router';
import {
  Actions,
  createEffect,
  ofType,
} from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  startLoading,
  goTo,
} from '../actions/app.actions';

@Injectable()
export class AppEffects {

  goTo$ = createEffect(
    () => this.actions$.pipe(
      ofType(goTo),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => of(
          this.router.navigate([action.route], action.data)
            .then(() => action.actionToPerformAfter && this.store.dispatch(action.actionToPerformAfter))
        )
        .pipe(
          catchError(errorCatcher(`Failed to navigate to ${action.route}.`))
        )
      ),
      tap(() => this.store.dispatch(finishLoading())),
    ),
    {
      dispatch: false,
    }
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(Store) private store: Store<any>,
    @Inject(Router) private router: Router,
  ) { }
}
