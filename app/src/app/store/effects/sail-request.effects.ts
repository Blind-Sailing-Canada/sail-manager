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
import { SailRequestStatus } from '../../../../../api/src/types/sail-request/sail-request-status';
import { SnackType } from '../../models/snack-state.interface';
import { viewSailRequestRoute } from '../../routes/routes';
import { SailRequestService } from '../../services/sail-request.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  goTo,
  startLoading,
} from '../actions/app.actions';
import {
  cancelSailRequest,
  createSailRequest,
  expireSailRequest,
  fetchSailRequest,
  fetchSailRequests,
  putSailRequest,
  putSailRequests,
  scheduleSailRequest,
  updateSailRequest,
} from '../actions/sail-request.actions';
import { putSnack } from '../actions/snack.actions';

@Injectable()
export class SailRequestEffects {

  createSailRequest$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(createSailRequest),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.sailRequestService.create(action.sailRequest)
            .pipe(
              mergeMap(sailRequest => of(
                putSailRequest({ sailRequest, id: sailRequest.id }),
                putSnack({ snack: { type: SnackType.INFO, message: 'Sail Request created.' } }),
                goTo({ route: viewSailRequestRoute(sailRequest.id) }),
              )),
              catchError(errorCatcher('Failed to create a sail request.'))
            )
        ),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  updateSailRequest$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(updateSailRequest),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.sailRequestService.update(action.id, action.sailRequest)
            .pipe(
              mergeMap(sailRequest => of(
                putSailRequest({ sailRequest, id: sailRequest.id }),
                putSnack({ snack: { type: SnackType.INFO, message: 'Sail Request updated.' } }),
              )),
              catchError(errorCatcher(`'Failed to update sail request ${action.id}.`))
            )
        ),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  cancelSailRequest$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(cancelSailRequest),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.sailRequestService.update(action.id, { status: SailRequestStatus.Cancelled })
            .pipe(
              mergeMap(sailRequest => of(
                putSailRequest({ sailRequest, id: sailRequest.id }),
                putSnack({ snack: { type: SnackType.INFO, message: 'Sail Request Cancelled.' } }),
              )),
              catchError(errorCatcher(`'Failed to cancel sail request ${action.id}.`))
            )
        ),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  expireSailRequest$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(expireSailRequest),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.sailRequestService.update(action.id, { status: SailRequestStatus.Expired })
            .pipe(
              mergeMap(sailRequest => of(
                putSailRequest({ sailRequest, id: sailRequest.id }),
                putSnack({ snack: { type: SnackType.INFO, message: 'Sail Request Expired.' } }),
              )),
              catchError(errorCatcher(`'Failed to expire sail request ${action.id}.`))
            )
        ),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  scheduleSailRequest$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(scheduleSailRequest),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.sailRequestService.update(action.id, { status: SailRequestStatus.Scheduled })
            .pipe(
              mergeMap(sailRequest => of(
                putSailRequest({ sailRequest, id: sailRequest.id }),
                putSnack({ snack: { type: SnackType.INFO, message: 'Sail Request Scheduled.' } }),
              )),
              catchError(errorCatcher(`'Failed to schedule sail request ${action.id}.`))
            )
        ),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  fetchSailRequests$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchSailRequests),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailRequestService.fetchAll(action.query)
          .pipe(
            mergeMap((sailRequests) => {
              if (action.notify) {
                return of(
                  putSailRequests({ sailRequests }),
                  putSnack({ snack: { type: SnackType.INFO, message: 'refreshed' } }),
                );
              }
              return of(putSailRequests({ sailRequests }));
            }),
            catchError(errorCatcher('Failed to fetch sail requests.'))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  fetchSailRequest$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchSailRequest),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailRequestService.fetchOne(action.id)
          .pipe(
            map(sailRequest => putSailRequest({ sailRequest, id: action.id })),
            catchError(errorCatcher(`Failed to fetch sail request: ${action.id}`))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(SailRequestService) private sailRequestService: SailRequestService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
