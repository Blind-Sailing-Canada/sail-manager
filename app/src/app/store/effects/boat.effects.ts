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
import { editBoatRoute } from '../../routes/routes';
import { BoatService } from '../../services/boat.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  goTo,
  startLoading,
} from '../actions/app.actions';
import {
  createBoat,
  fetchBoat,
  fetchBoats,
  putBoat,
  putBoats,
  updateBoat,
} from '../actions/boat.actions';
import { putSnack } from '../actions/snack.actions';

@Injectable()
export class BoatEffects {

  createBoat$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(createBoat),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.boatService.create(action.boat)
            .pipe(
              mergeMap(boat => of(
                putBoat({ boat, boat_id: boat.id }),
                putSnack({ snack: { type: SnackType.INFO, message: 'Boat created.' } }),
                goTo({ route: editBoatRoute(boat.id) }),
              )),
              catchError(errorCatcher('Failed to create a boat.'))
            )
        ),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  updateBoat$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(updateBoat),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.boatService.update(action.boat_id, action.boat)
            .pipe(
              mergeMap(boat => of(
                putBoat({ boat, boat_id: boat.id }),
                putSnack({ snack: { type: SnackType.INFO, message: 'Boat updated.' } }),
              )),
              catchError(errorCatcher(`'Failed to update boat ${action.boat_id}.`))
            )
        ),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  fetchBoats$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchBoats),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.boatService.fetchAll()
          .pipe(
            mergeMap((boats) => {
              if (action.notify) {
                return of(
                  putBoats({ boats }),
                  putSnack({ snack: { type: SnackType.INFO, message: 'refreshed' } }),
                );
              }
              return of(putBoats({ boats }));
            }),
            catchError(errorCatcher('Failed to fetch boats.'))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  fetchBoat$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchBoat),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.boatService.fetchOne(action.boat_id)
          .pipe(
            map(boat => putBoat({ boat, boat_id: action.boat_id })),
            catchError(errorCatcher(`Failed to fetch boat: ${action.boat_id}`))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(BoatService) private boatService: BoatService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
