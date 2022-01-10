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
import { editDocumentRoute, listDocumentsRoute } from '../../routes/routes';
import { DocumentService } from '../../services/document.service';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  goTo,
  startLoading,
} from '../actions/app.actions';
import {
  createDocument,
  deleteDocument,
  fetchDocument,
  fetchDocuments,
  putDocument,
  putDocuments,
  removeDocument,
  updateDocument,
} from '../actions/document.actions';
import { putSnack } from '../actions/snack.actions';

@Injectable()
export class DocumentEffects {

  createDocument$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(createDocument),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.documentService.create(action.document)
            .pipe(
              mergeMap(document => of(
                putDocument({ document, id: document.id }),
                putSnack({ snack: { type: SnackType.INFO, message: 'Document created.' } }),
                goTo({ route: editDocumentRoute(document.id) }),
              )),
              catchError(errorCatcher('Failed to create a document.'))
            )
        ),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  updateDocument$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(updateDocument),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.documentService.update(action.id, action.document)
            .pipe(
              mergeMap(document => of(
                putDocument({ document, id: document.id }),
                putSnack({ snack: { type: SnackType.INFO, message: 'Document updated.' } }),
              )),
              catchError(errorCatcher(`'Failed to update document ${action.id}.`))
            )
        ),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  fetchDocuments$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchDocuments),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.documentService.fetchAll(action.entity_type, action.entity_id)
          .pipe(
            mergeMap((documents) => {
              if (action.notify) {
                return of(
                  putDocuments({ documents }),
                  putSnack({ snack: { type: SnackType.INFO, message: `Fetched ${documents.length} documents` } }),
                );
              }
              return of(putDocuments({ documents }));
            }),
            catchError(errorCatcher('Failed to fetch documents.'))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  fetchDocument$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchDocument),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.documentService.fetchOne(action.id)
          .pipe(
            map(document => putDocument({ document, id: action.id })),
            catchError(errorCatcher(`Failed to fetch document: ${action.id}`))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  deleteDocument$ = createEffect(
    () => this.actions$.pipe(
      ofType(deleteDocument),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.documentService.delete(action.id)
          .pipe(
            mergeMap(
              () => of(
                goTo({ route: listDocumentsRoute(), actionToPerformAfter: removeDocument({ id: action.id }) }),
              )
            ),
            catchError(errorCatcher(`Failed to delete document: ${action.id}`))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(DocumentService) private documentService: DocumentService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
