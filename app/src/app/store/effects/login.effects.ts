import { of } from 'rxjs';
import {
  catchError,
  map,
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
import { FullRoutes } from '../../routes/routes';
import { AuthService } from '../../services/auth.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  goTo,
  startLoading,
} from '../actions/app.actions';
import {
  authenticateWithGoogle,
  loggedIn,
  loggedOut,
  logIn,
  logOut,
  putToken,
  resetLogin,
} from '../actions/login.actions';
import { putProfile } from '../actions/profile.actions';
import { putSnack } from '../actions/snack.actions';

@Injectable()
export class LoginEffects {

  authenticateWithGoogle$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(authenticateWithGoogle),
        tap(() => this.store.dispatch(startLoading())),
        map(() => window.location.href = `${window.location.origin}/api/auth/google`),
        tap(() => this.store.dispatch(finishLoading())),
      ),
    {
      dispatch: false,
    }
  );

  login$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(logIn),
        tap(() => this.store.dispatch(startLoading())),
        tap(action => this.store.dispatch(putToken({ token: action.token }))),
        mergeMap(
          action => this.authService
            .login(action.token)
            .pipe(
              mergeMap(profile => of(
                putProfile({ profile, id: profile.id, }),
                loggedIn({ token: action.token, user: profile })),
              ),
              catchError(errorCatcher('Failed to login.'))
            )
        ),
        tap(() => this.store.dispatch(finishLoading())),
      ),
  );

  logout$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(logOut),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.authService
            .logout()
            .pipe(
              mergeMap(() => of(
                loggedOut(),
                goTo({ route: FullRoutes.LOGIN.toString() }),
                resetLogin(),
                putSnack({ snack: { type: SnackType.INFO, message: action.message || 'Bye. See you soon!' } }),
              )),
              catchError(
                errorCatcher(
                  'Failed to logout.',
                  [
                    loggedOut(),
                    goTo({ route: FullRoutes.LOGIN.toString() }),
                    resetLogin(),
                    putSnack({ snack: { type: SnackType.INFO, message: 'Bye. See you soon!' } }),
                  ]
                )
              )
            )
        ),
        tap(() => this.store.dispatch(finishLoading())),
      ),
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(AuthService) private authService: AuthService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
