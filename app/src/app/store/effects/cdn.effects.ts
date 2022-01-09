import {
  EMPTY,
  of,
} from 'rxjs';
import {
  catchError,
  concatMap,
  exhaustMap,
  tap,
} from 'rxjs/operators';
import {
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
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
import { CDNService } from '../../services/cdn.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  startLoading,
} from '../actions/app.actions';
import {
  deletedFile,
  deleteError,
  deleteFile,
  finishUploading,
  startUploading,
  uploadArrivalInstructionsPicture,
  uploadBoatMaintenancePicture,
  uploadBoatPicture,
  uploadChallengePicture,
  uploadDepartureInstructionsPicture,
  uploadDocument,
  uploadError,
  uploadMaintenancePicture,
  uploadProfilePicture,
  uploadProgress,
  uploadSailPicture,
} from '../actions/cdn.actions';
import { putSnack } from '../actions/snack.actions';

@Injectable()
export class CDNEffects {

  uploadChallengePicture$ = createEffect(
    () => this.actions$.pipe(
      ofType(uploadChallengePicture),
      tap(() => this.store.dispatch(startLoading())),
      exhaustMap(
        action => this.service
          .uploadChallengePicture(action.file, action.challengeId)
          .pipe(
            concatMap((event: HttpEvent<string>) => {
              const processResult = this.processHttpEvent(event, action.file, action.notify);

              if (processResult) {
                return processResult;
              }

              console.error(`unhandled http event: ${event.type}`);
              return of(putSnack({ snack: { message: 'something went wrong...', type: SnackType.ERROR } }));
            }),
            catchError(
              errorCatcher(
                `Failed to upload challenge picture: ${action.file.name}`,
                null,
                error => [uploadError({ error, fileName: action.file.name, message: 'Failed to upload pictures' })]))
          )
      ),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  uploadBoatMaintenancePicture$ = createEffect(
    () => this.actions$.pipe(
      ofType(uploadBoatMaintenancePicture),
      tap(() => this.store.dispatch(startLoading())),
      exhaustMap(
        action => this.service
          .uploadBoatMaintenancePicture(action.file, action.maintenanceId)
          .pipe(
            concatMap((event: HttpEvent<string>) => {
              const processResult = this.processHttpEvent(event, action.file, action.notify);

              if (processResult) {
                return processResult;
              }

              console.error(`unhandled http event: ${event.type}`);
              return of(putSnack({ snack: { message: 'something went wrong...', type: SnackType.ERROR } }));
            }),
            catchError(
              errorCatcher(
                `Failed to upload maintenance picture: ${action.file.name}`,
                null,
                error => [uploadError({ error, fileName: action.file.name, message: 'Failed to upload pictures' })]))
          )
      ),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  uploadSailPicture$ = createEffect(
    () => this.actions$.pipe(
      ofType(uploadSailPicture),
      tap(() => this.store.dispatch(startLoading())),
      exhaustMap(
        action => this.service
          .uploadSailPicture(action.file, action.sail_id)
          .pipe(
            concatMap((event: HttpEvent<string>) => {
              const processResult = this.processHttpEvent(event, action.file, action.notify);

              if (processResult) {
                return processResult;
              }

              console.error(`unhandled http event: ${event.type}`);
              return of(putSnack({ snack: { message: 'something went wrong...', type: SnackType.ERROR } }));
            }),
            catchError(
              errorCatcher(
                `Failed to upload sail picture: ${action.file.name}`,
                null,
                error => [uploadError({ error, fileName: action.file.name, message: 'Failed to upload pictures' })]))
          )
      ),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  uploadMaintenancePicture$ = createEffect(
    () => this.actions$.pipe(
      ofType(uploadMaintenancePicture),
      tap(() => this.store.dispatch(startLoading())),
      exhaustMap(
        action => this.service
          .uploadMaintenancePicture(action.file)
          .pipe(
            concatMap((event: HttpEvent<string>) => {
              const processResult = this.processHttpEvent(event, action.file, action.notify);

              if (processResult) {
                return processResult;
              }

              console.error(`unhandled http event: ${event.type}`);
              return of(putSnack({ snack: { message: 'something went wrong...', type: SnackType.ERROR } }));
            }),
            catchError(
              errorCatcher(
                `Failed to upload maintenance picture: ${action.file.name}`,
                null,
                error => [uploadError({ error, fileName: action.file.name, message: 'Failed to upload pictures' })]))
          )
      ),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  uploadDocument$ = createEffect(
    () => this.actions$.pipe(
      ofType(uploadDocument),
      tap(() => this.store.dispatch(startLoading())),
      exhaustMap(
        action => this.service
          .uploadDocument(action.file, action.document_id)
          .pipe(
            concatMap((event: HttpEvent<string>) => {
              const processResult = this.processHttpEvent(event, action.file, action.notify);

              if (processResult) {
                return processResult;
              }

              console.error(`unhandled http event: ${event.type}`);
              return of(putSnack({ snack: { message: 'something went wrong...', type: SnackType.ERROR } }));
            }),
            catchError(
              errorCatcher(
                `Failed to upload document: ${action.file.name}`,
                null,
                error => [uploadError({ error, fileName: action.file.name, message: 'Failed to upload document' })]))
          )
      ),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  uploadProfilePicture$ = createEffect(
    () => this.actions$.pipe(
      ofType(uploadProfilePicture),
      tap(() => this.store.dispatch(startLoading())),
      exhaustMap(
        action => this.service
          .uploadProfilePicture(action.file, action.profile_id)
          .pipe(
            concatMap((event: HttpEvent<string>) => {
              const processResult = this.processHttpEvent(event, action.file, action.notify);

              if (processResult) {
                return processResult;
              }

              console.error(`unhandled http event: ${event.type}`);
              return of(putSnack({ snack: { message: 'something went wrong...', type: SnackType.ERROR } }));
            }),
            catchError(
              errorCatcher(
                `Failed to upload profile picture: ${action.file.name}`,
                null,
                error => [uploadError({ error, fileName: action.file.name, message: 'Failed to upload pictures' })]))
          )
      ),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  uploadBoatPicture$ = createEffect(
    () => this.actions$.pipe(
      ofType(uploadBoatPicture),
      tap(() => this.store.dispatch(startLoading())),
      exhaustMap(
        action => this.service
          .uploadBoatPicture(action.file, action.boat_id)
          .pipe(
            concatMap((event: HttpEvent<string>) => {
              const processResult = this.processHttpEvent(event, action.file, action.notify);

              if (processResult) {
                return processResult;
              }

              console.error(`unhandled http event: ${event.type}`);
              return of(putSnack({ snack: { message: 'something went wrong...', type: SnackType.ERROR } }));
            }),
            catchError(
              errorCatcher(
                `Failed to upload boat picture: ${action.file.name}`,
                null,
                error => [uploadError({ error, fileName: action.file.name, message: 'Failed to upload pictures' })]))
          )
      ),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  uploadDepartureInstructionsPicture$ = createEffect(
    () => this.actions$.pipe(
      ofType(uploadDepartureInstructionsPicture),
      tap(() => this.store.dispatch(startLoading())),
      exhaustMap(
        action => this.service
          .uploadDepartureInstructionsPicture(action.file, action.boat_id)
          .pipe(
            concatMap((event: HttpEvent<string>) => {
              const processResult = this.processHttpEvent(event, action.file, action.notify);

              if (processResult) {
                return processResult;
              }

              console.error(`unhandled http event: ${event.type}`);
              return of(putSnack({ snack: { message: 'something went wrong...', type: SnackType.ERROR } }));
            }),
            catchError(
              errorCatcher(
                `Failed to upload departure instructions picture: ${action.file.name}`,
                null,
                error => [uploadError({ error, fileName: action.file.name, message: 'Failed to upload pictures' })]))
          )
      ),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  uploadArrivalInstructionsPicture$ = createEffect(
    () => this.actions$.pipe(
      ofType(uploadArrivalInstructionsPicture),
      tap(() => this.store.dispatch(startLoading())),
      exhaustMap(
        action => this.service
          .uploadArrivalInstructionsPicture(action.file, action.boat_id)
          .pipe(
            concatMap((event: HttpEvent<string>) => {
              const processResult = this.processHttpEvent(event, action.file, action.notify);

              if (processResult) {
                return processResult;
              }

              console.error(`unhandled http event: ${event.type}`);
              return of(putSnack({ snack: { message: 'something went wrong...', type: SnackType.ERROR } }));
            }),
            catchError(
              errorCatcher(
                `Failed to upload arrival instructions picture: ${action.file.name}`,
                null,
                error => [uploadError({ error, fileName: action.file.name, message: 'Failed to upload pictures' })]))
          )
      ),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  deleteFile$ = createEffect(
    () => this.actions$.pipe(
      ofType(deleteFile),
      tap(() => this.store.dispatch(startLoading())),
      exhaustMap(
        action => this.service
          .deleteFile(action.filePath)
          .pipe(
            concatMap(() => {
              if (action.notify) {
                return of(
                  putSnack({ snack: { message: 'Deleted file', type: SnackType.INFO } }),
                  deletedFile({ filePath: action.filePath }),
                );
              }
              return of(deletedFile({ filePath: action.filePath }));
            }),
            catchError(
              errorCatcher(
                `Failed to delete file: ${action.filePath}`,
                null,
                error => [deleteError({ error, filePath: action.filePath, message: 'Failed to delete pictures' })]))
          )
      ),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(Store) private store: Store<any>,
    @Inject(CDNService) private service: CDNService,
  ) { }

  private processHttpEvent(event: HttpEvent<any>, file: File, notify: boolean) {
    switch (event.type) {
      case HttpEventType.Sent:
        return of(startUploading({ fileName: file.name }));
      case HttpEventType.ResponseHeader:
      case HttpEventType.DownloadProgress:
        return EMPTY;
      case HttpEventType.UploadProgress:
        // eslint-disable-next-line @typescript-eslint/dot-notation
        const percentage = ((event['loaded'] || file.size) / file.size) * 100;
        const progress = Math.min(100, Math.round(percentage));

        return of(
          uploadProgress(
            {
              progress,
              fileName: file.name,
            }
          )
        );
      case HttpEventType.Response:
        if (notify) {
          return of(
            finishUploading({ fileName: file.name, url: event.body }),
            putSnack({ snack: { message: 'Uploaded file', type: SnackType.INFO } })
          );
        }
        return of(finishUploading({ fileName: file.name, url: event.body }));

    }
  }
}
