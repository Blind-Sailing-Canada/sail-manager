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
import { putSnack } from '../actions/snack.actions';
import { interestedSailRequest, uninterestedSailRequest } from '../actions/sail-request-interest.actions';
import { SailRequestInterestService } from '../../services/sail-request-interest.service';
import { putSailRequest } from '../actions/sail-request.actions';

@Injectable()
export class SailRequestInterestEffects {

  interestedSailRequest$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(interestedSailRequest),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.sailRequestInterestService.interested(action.sail_request_id)
            .pipe(
              mergeMap(sailRequest => of(
                putSailRequest({ sailRequest, id: sailRequest.id }),
                putSnack({ snack: { type: SnackType.INFO, message: 'You are interested in going on this sail.' } }),
              )),
              catchError(errorCatcher('Failed to join sail request.'))
            )
        ),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  uninterestedSailRequest$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(uninterestedSailRequest),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.sailRequestInterestService.uninterested(action.sail_request_id)
            .pipe(
              mergeMap(sailRequest => of(
                putSailRequest({ sailRequest, id: sailRequest.id }),
                putSnack({ snack: { type: SnackType.INFO, message: 'You are not interested in going on this sail.' } }),
              )),
              catchError(errorCatcher('Failed to leave sail request.'))
            )
        ),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(SailRequestInterestService) private sailRequestInterestService: SailRequestInterestService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
