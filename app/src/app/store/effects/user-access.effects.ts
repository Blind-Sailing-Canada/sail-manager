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
import { UserAccessService } from '../../services/user-access.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  startLoading,
} from '../actions/app.actions';
import {
  fetchUserAccess,
  putUserAccess,
} from '../actions/user-access.actions';

@Injectable()
export class UserAccessEffects {

  fetchUserAccess$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchUserAccess),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.userAccessService.getUserAccess(action.profile_id)
          .pipe(
            map(returnedAccess => putUserAccess({ profile_id: action.profile_id, access: returnedAccess })),
            catchError(errorCatcher(`Failed to fetch user access: ${action.profile_id}`))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(UserAccessService) private userAccessService: UserAccessService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
