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
import {
  createSailCategory,
  deleteSailCategory,
  fetchSailCategories,
  putSailCategories,
  putSailCategory,
  removeSailCategory
} from '../actions/sail-category.actions';
import { SailCategoryService } from '../../services/sail-category.service';

@Injectable()
export class SailCategoryEffects {

  createSailCategory$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(createSailCategory),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.sailCategoryService.create(action.category)
            .pipe(
              mergeMap(createdSailCategory => of(
                putSailCategory({ category: createdSailCategory, id: createdSailCategory.id }),
                putSnack({ snack: { type: SnackType.INFO, message: 'Sail category created.' } }),
              )),
              catchError(errorCatcher('Failed to create sail category.'))
            )
        ),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  deleteSailCategory$ = createEffect(
    () => this.actions$
      .pipe(
        ofType(deleteSailCategory),
        tap(() => this.store.dispatch(startLoading())),
        mergeMap(
          action => this.sailCategoryService.delete(action.id)
            .pipe(
              mergeMap(() => of(
                removeSailCategory({ id: action.id }),
                putSnack({ snack: { type: SnackType.INFO, message: 'Sail category deleted.' } }),
              )),
              catchError(errorCatcher(`'Failed to delete sail category ${action.id}.`))
            )
        ),
        tap(() => this.store.dispatch(finishLoading())),
      )
  );

  fetchSailCategories$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchSailCategories),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.sailCategoryService.fetchAll()
          .pipe(
            mergeMap((categories) => {
              if (action.notify) {
                return of(
                  putSailCategories({ categories }),
                  putSnack({ snack: { type: SnackType.INFO, message: `found ${categories.length} sail categories` } }),
                );
              }
              return of(putSailCategories({ categories }));
            }),
            catchError(errorCatcher('Failed to fetch sail categories.'))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(SailCategoryService) private sailCategoryService: SailCategoryService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
