import { of } from 'rxjs';
import {
  catchError,
  mergeMap,
  filter,
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
import { SailChecklistService } from '../../services/sail-checklist.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  startLoading,
} from '../actions/app.actions';
import {
  createSailChecklist,
  fetchSailChecklist,
  findSailChecklists,
  putSailChecklist,
  putSailChecklists,
  updateSailChecklist,
  updateSailChecklists,
} from '../actions/sail-checklist.actions';
import { putSnack } from '../actions/snack.actions';
import { putSail } from '../actions/sail.actions';

@Injectable()
export class SailChecklistEffects {

  createSailChecklist$ = createEffect(
    () => this.actions$.pipe(
      ofType(createSailChecklist),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailChecklistService.create(action.checklist)
          .pipe(
            mergeMap(checklist => of(
              putSnack({ snack: { type: SnackType.INFO, message: 'Sail checklist created!' } }),
              putSailChecklist({ checklist, sail_checklist_id: checklist.id })
            )),
            catchError(errorCatcher('Failed to create sail checklist')),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  updateSailChecklist$ = createEffect(
    () => this.actions$.pipe(
      ofType(updateSailChecklist),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailChecklistService.update(action.sail_checklist_id, action.checklist)
          .pipe(
            mergeMap(checklist => of(
              putSailChecklist({ checklist, sail_checklist_id: action.sail_checklist_id }),
              ...(action.updateActions || []),
              putSnack({ snack: { type: SnackType.INFO, message: 'Saved' } }),
            )),
            catchError(errorCatcher(`Failed to update sail checklist: ${action.sail_checklist_id}`)),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  updateSailChecklists$ = createEffect(
    () => this.actions$.pipe(
      ofType(updateSailChecklists),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailChecklistService
          .updateSailChecklists(action.sail_id, action.checklistsData)
          .pipe(
            mergeMap((sail) => of(
              putSail({ sail, id: action.sail_id }),
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'Saved' } }),
            )),
            catchError(errorCatcher(`Failed to update sail checklist for sail: ${action.sail_id}`, null, null, action.notify)),
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  fetchSailChecklist$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchSailChecklist),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailChecklistService.fetchOne(action.sail_checklist_id)
          .pipe(
            mergeMap((checklist) => {
              if (action.notify) {
                return of(
                  putSailChecklist({ checklist, sail_checklist_id: action.sail_checklist_id }),
                  putSnack({ snack: { type: SnackType.INFO, message: 'refreshed' } }),
                );
              }
              return of(putSailChecklist({ checklist, sail_checklist_id: action.sail_checklist_id }));
            }),
            catchError(
              errorCatcher(
                `Failed to fetch sail checklist: ${action.sail_checklist_id}`,
                [putSailChecklist({ checklist: null, sail_checklist_id: action.sail_checklist_id })],
              )),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  findSailChecklists$ = createEffect(
    () => this.actions$.pipe(
      ofType(findSailChecklists),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailChecklistService.find(action.query)
          .pipe(
            mergeMap((checklists) => of(putSailChecklists({ checklists }))),
            catchError(
              errorCatcher('Failed to find sail checklists')),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(SailChecklistService) private sailChecklistService: SailChecklistService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
