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
import { editClinicRoute } from '../../routes/routes';
import { ClinicService } from '../../services/clinic.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  goTo,
  startLoading,
} from '../actions/app.actions';
import {
  addUserToClinic,
  createClinic,
  enrollInClinic,
  fetchClinic,
  fetchClinics,
  graduateUserFromClinic,
  leaveClinic,
  putClinic,
  putClinics,
  removeUserFromClinic,
  updateClinic,
} from '../actions/clinic.actions';
import { putSnack } from '../actions/snack.actions';

@Injectable()
export class ClinicsEffects {

  fetchClinic$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchClinic),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.service
          .fetchClinic(action.clinicId)
          .pipe(
            concatMap(returnedClinic => of(
              putClinic({ clinicId: action.clinicId, clinic: returnedClinic }),
              action.notify && putSnack({ snack: { message: 'Fetched clinic.', type: SnackType.INFO } })
            )),
            catchError(errorCatcher(`Failed to fetch clinic ${action.clinicId}.`))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  fetchClinics$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchClinics),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.service
          .fetchClinics(action.query)
          .pipe(
            concatMap(returnedClinics => of(
              putClinics({ clinics: returnedClinics }),
              action.notify && putSnack({ snack: { message: `Fetched ${returnedClinics.length} clinics.`, type: SnackType.INFO } })
            )),
            catchError(errorCatcher(`Failed to fetch clinics.`))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  createClinic$ = createEffect(
    () => this.actions$.pipe(
      ofType(createClinic),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.service
          .createClinic(action.clinic)
          .pipe(
            concatMap(returnedClinic => of(
              putClinic({ clinicId: returnedClinic.id, clinic: returnedClinic }),
              goTo({ route: editClinicRoute(returnedClinic.id) }),
              action.notify && putSnack({ snack: { message: `Created clinic.`, type: SnackType.INFO } })
            )),
            catchError(errorCatcher(`Failed to create clinic.`))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  updateClinic$ = createEffect(
    () => this.actions$.pipe(
      ofType(updateClinic),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.service
          .updateClinic(action.clinicId, action.clinic)
          .pipe(
            concatMap(returnedClinic => of(
              putClinic({ clinicId: action.clinicId, clinic: returnedClinic }),
              action.notify && putSnack({ snack: { message: `Updated clinic.`, type: SnackType.INFO } })
            )),
            catchError(errorCatcher(`Failed to update clinic ${action.clinicId}.`))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  enrollInClinic$ = createEffect(
    () => this.actions$.pipe(
      ofType(enrollInClinic),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.service
          .enrollInClinic(action.clinicId, action.profile_id)
          .pipe(
            concatMap(returnedClinic => of(
              putClinic({ clinicId: action.clinicId, clinic: returnedClinic }),
              action.notify && putSnack({ snack: { message: `Enrolled in clinic.`, type: SnackType.INFO } })
            )),
            catchError(errorCatcher(`Failed to enroll in clinic.`))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  leaveClinic$ = createEffect(
    () => this.actions$.pipe(
      ofType(leaveClinic),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.service
          .leaveClinic(action.clinicId, action.profile_id)
          .pipe(
            concatMap(returnedClinic => of(
              putClinic({ clinicId: action.clinicId, clinic: returnedClinic }),
              action.notify && putSnack({ snack: { message: `Left clinic.`, type: SnackType.INFO } })
            )),
            catchError(errorCatcher(`Failed to leave clinic.`))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  addUserToClinicClinic$ = createEffect(
    () => this.actions$.pipe(
      ofType(addUserToClinic),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.service
          .addUserToClinic(action.clinicId, action.profile_id)
          .pipe(
            concatMap(returnedClinic => of(
              putClinic({ clinicId: action.clinicId, clinic: returnedClinic }),
              action.notify && putSnack({ snack: { message: `Added user to clinic.`, type: SnackType.INFO } })
            )),
            catchError(errorCatcher(`Failed to add user to clinic.`))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  removeUserFromClinicClinic$ = createEffect(
    () => this.actions$.pipe(
      ofType(removeUserFromClinic),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.service
          .removeUserToClinic(action.clinicId, action.profile_id)
          .pipe(
            concatMap(returnedClinic => of(
              putClinic({ clinicId: action.clinicId, clinic: returnedClinic }),
              action.notify && putSnack({ snack: { message: `Removed user from clinic.`, type: SnackType.INFO } })
            )),
            catchError(errorCatcher(`Failed to remove user from clinic.`))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  graduateUserFromClinic$ = createEffect(
    () => this.actions$.pipe(
      ofType(graduateUserFromClinic),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.service
          .graduateUserFromClinic(action.clinicId, action.profile_id)
          .pipe(
            concatMap(returnedClinic => of(
              putClinic({ clinicId: action.clinicId, clinic: returnedClinic }),
              action.notify && putSnack({ snack: { message: `Graduated user from clinic.`, type: SnackType.INFO } })
            )),
            catchError(errorCatcher(`Failed to graduate user from clinic.`))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(ClinicService) private service: ClinicService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
