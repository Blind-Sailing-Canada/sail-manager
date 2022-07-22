import {
  EMPTY,
  of,
} from 'rxjs';
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
import {
  arrivalSailChecklistRoute,
  departureSailChecklistRoute,
  viewSailRoute,
} from '../../routes/routes';
import { SailService } from '../../services/sail.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  goTo,
  startLoading,
} from '../actions/app.actions';
import {
  cancelSail,
  completeSail,
  createSail,
  createSailFromSailRequest,
  deleteSailComment,
  fetchSail,
  fetchSailByNumber,
  fetchSails,
  joinSailAsCrew,
  joinSailAsSailor,
  joinSailAsSkipper,
  leaveSail,
  postSailComment,
  putSail,
  putSails,
  sendSailNotification,
  startSail,
  updateSail,
} from '../actions/sail.actions';
import { putSnack } from '../actions/snack.actions';

@Injectable()
export class SailEffects {

  sendSailNotification$ = createEffect(
    () => this.actions$.pipe(
      ofType(sendSailNotification),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService
          .sendNotification(action.sail_id, action.notificationType, action.notificationMessage)
          .pipe(
            mergeMap(() => of(
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'Notification sent!' } }),
            )),
            catchError(errorCatcher('Failed to send sail notification.'))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  startSail$ = createEffect(
    () => this.actions$.pipe(
      ofType(startSail),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService
          .startSail(action.sail.id)
          .pipe(
            mergeMap(sail => of(
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'You started this sail!' } }),
              putSail({ sail, id: action.sail.id }),
              goTo({ route: departureSailChecklistRoute(sail.id) })
            )),
            catchError(errorCatcher('Failed to start the sail.'))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  completeSail$ = createEffect(
    () => this.actions$.pipe(
      ofType(completeSail),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService
          .completeSail(action.sail.id)
          .pipe(
            mergeMap(sail => of(
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'You completed this sail!' } }),
              putSail({ sail, id: action.sail.id }),
              goTo({ route: arrivalSailChecklistRoute(sail.id) })
            )),
            catchError(errorCatcher('Failed to complete the sail.'))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  cancelSail$ = createEffect(
    () => this.actions$.pipe(
      ofType(cancelSail),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService
          .cancelSail(action.sail_id, action.sail)
          .pipe(
            mergeMap(sail => of(
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'You cancelled this sail!' } }),
              putSail({ sail, id: action.sail_id }),
              goTo({ route: viewSailRoute(sail.id) })
            )),
            catchError(errorCatcher('Failed to cancel the sail.'))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  joinSailAsCrew$ = createEffect(
    () => this.actions$.pipe(
      ofType(joinSailAsCrew),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService
          .joinAsCrew(action.sail_id)
          .pipe(
            mergeMap(sail => of(
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'You joined the sail as crew!' } }),
              putSail({ sail, id: action.sail_id })
            )),
            catchError(errorCatcher('Failed to join sail as crew'))
          ),
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  joinSailAsSailor$ = createEffect(
    () => this.actions$.pipe(
      ofType(joinSailAsSailor),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService
          .joinAsSailor(action.sail_id)
          .pipe(
            mergeMap(sail => of(
              putSnack({ snack: { type: SnackType.INFO, message: 'You joined the sail as a sailor!' } }),
              putSail({ sail, id: action.sail_id })
            )),
            catchError(errorCatcher('Failed to join sail as sailor'))
          ),
      ),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  joinSailAsSkipper$ = createEffect(
    () => this.actions$.pipe(
      ofType(joinSailAsSkipper),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService
          .joinAsSkipper(action.sail_id)
          .pipe(
            mergeMap(sail => of(
              putSnack({ snack: { type: SnackType.INFO, message: 'You joined the sail as a skipper!' } }),
              putSail({ sail, id: action.sail_id })
            )),
            catchError(errorCatcher('Failed to join sail as skipper'))
          ),
      ),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  leaveSail$ = createEffect(
    () => this.actions$.pipe(
      ofType(leaveSail),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService
          .leaveSail(action.sail_id)
          .pipe(
            mergeMap(sail => of(
              putSnack({ snack: { type: SnackType.INFO, message: 'You left the sail!' } }),
              putSail({ sail, id: action.sail_id })
            )),
            catchError(errorCatcher('Failed to leave sail'))
          ),
      ),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  postSailComment$ = createEffect(
    () => this.actions$.pipe(
      ofType(postSailComment),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.postNewComment(action.sail_id, action.comment)
          .pipe(
            mergeMap(sail => of(
              (action.notify ? putSnack({ snack: { type: SnackType.INFO, message: 'Comment posted' } }) : EMPTY),
              putSail({ sail, id: action.sail_id }),
            )),
            catchError(errorCatcher(`Failed to post comment to sail: ${action.sail_id}`)),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  deleteSailComment$ = createEffect(
    () => this.actions$.pipe(
      ofType(deleteSailComment),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.deleteComment(action.sail_id, action.comment_id)
          .pipe(
            mergeMap(sail => of(
              (action.notify ? putSnack({ snack: { type: SnackType.INFO, message: 'Comment deleted' } }) : EMPTY),
              putSail({ sail, id: action.sail_id }),
            )),
            catchError(errorCatcher(`Failed to delete comment to sail: ${action.sail_id}`)),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  createSail$ = createEffect(
    () => this.actions$.pipe(
      ofType(createSail),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.create(action.sail)
          .pipe(
            mergeMap(sail => of(
              putSnack({ snack: { type: SnackType.INFO, message: 'Sail created!' } }),
              putSail({ sail, id: sail.id }),
              goTo({ route: viewSailRoute(sail.id) }),
            )),
            catchError(errorCatcher(`Failed to create sail: ${action.sail.name}`)),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  createSailFromSailRequest$ = createEffect(
    () => this.actions$.pipe(
      ofType(createSailFromSailRequest),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.createFromSailRequest(action.sail, action.sail_request_id)
          .pipe(
            mergeMap(sail => of(
              putSnack({ snack: { type: SnackType.INFO, message: 'Sail created!' } }),
              putSail({ sail, id: sail.id }),
              goTo({ route: viewSailRoute(sail.id) }),
            )),
            catchError(errorCatcher(`Failed to create sail: ${action.sail.name}`)),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  updateSail$ = createEffect(
    () => this.actions$.pipe(
      ofType(updateSail),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.update(action.id, action.sail)
          .pipe(
            mergeMap(sail => of(
              putSail({ sail, id: action.id }),
              ...(action.updateActions || []),
              putSnack({ snack: { type: SnackType.INFO, message: 'Saved' } }),
            )),
            catchError(errorCatcher(`Failed to update sail: ${action.id}`)),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  fetchSails$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchSails),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.fetchAll(action.query)
          .pipe(
            mergeMap((sails) => {
              if (action.notify) {
                return of(
                  putSails({ sails }),
                  putSnack({ snack: { type: SnackType.INFO, message: `Fetched ${sails.length} sails.` } }),
                );
              }
              return of(putSails({ sails }));
            }),
            catchError(errorCatcher('Failed to fetch sails', [putSails({ sails: [] })]))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  fetchSail$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchSail),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.fetchOne(action.sail_id)
          .pipe(
            mergeMap((sail) => {
              if (action.notify) {
                return of(
                  putSail({ sail, id: action.sail_id }),
                  putSnack({ snack: { type: SnackType.INFO, message: 'refreshed' } }),
                );
              }
              return of(putSail({ sail, id: action.sail_id }));
            }),
            catchError(errorCatcher(`Failed to fetch sail: ${action.sail_id}`, [putSail({ sail: null, id: action.sail_id })])),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  fetchSailByNumber$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchSailByNumber),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailService.fetchOneByNumber(action.sail_number)
          .pipe(
            mergeMap((sail) => {
              if (action.notify) {
                return of(
                  putSail({ sail, id: sail.id }),
                  putSnack({ snack: { type: SnackType.INFO, message: 'refreshed' } }),
                );
              }
              return of(putSail({ sail, id: sail.id }));
            }),
            catchError(errorCatcher(`Failed to fetch sail: ${action.sail_number}`, [putSail({ sail: null, id: `${action.sail_number}` })])),
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
