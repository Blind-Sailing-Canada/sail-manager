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
  viewSocialRoute,
} from '../../routes/routes';
import { errorCatcher } from '../../utils/error-catcher';
import {
  finishLoading,
  goTo,
  startLoading,
} from '../actions/app.actions';
import { putSnack } from '../actions/snack.actions';
import { SocialService } from '../../services/social.service';
import {
  cancelSocial,
  completeSocial,
  createSocial,
  deleteSocialComment,
  fetchSocial,
  joinSocial,
  leaveSocial,
  postSocialComment,
  putSocial,
  sendSocialNotification,
  updateSocial,
} from '../actions/social.actions';

@Injectable()
export class SocialEffects {

  sendSocialNotification$ = createEffect(
    () => this.actions$.pipe(
      ofType(sendSocialNotification),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.socialService
          .sendNotification(action.social_id, action.notificationType, action.notificationMessage)
          .pipe(
            mergeMap(() => of(
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'Notification sent!' } }),
            )),
            catchError(errorCatcher('Failed to send social notification.'))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  completeSocial$ = createEffect(
    () => this.actions$.pipe(
      ofType(completeSocial),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.socialService
          .completeSocial(action.social.id)
          .pipe(
            mergeMap(social => of(
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'You completed this social!' } }),
              putSocial({ social, id: action.social.id }),
            )),
            catchError(errorCatcher('Failed to complete the social.'))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  cancelSocial$ = createEffect(
    () => this.actions$.pipe(
      ofType(cancelSocial),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.socialService
          .cancelSocial(action.social_id, action.social)
          .pipe(
            mergeMap(social => of(
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'You cancelled this social!' } }),
              putSocial({ social, id: action.social_id }),
            )),
            catchError(errorCatcher('Failed to cancel the social.'))
          )
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    )
  );

  joinSocial$ = createEffect(
    () => this.actions$.pipe(
      ofType(joinSocial),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.socialService
          .joinSocial(action.social_id)
          .pipe(
            mergeMap(social => of(
              action.notify && putSnack({ snack: { type: SnackType.INFO, message: 'You joined the social!' } }),
              putSocial({ social, id: action.social_id }),
            )),
            catchError(errorCatcher('Failed to join social'))
          ),
      ),
      filter(action => action && action.type),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  leaveSocial$ = createEffect(
    () => this.actions$.pipe(
      ofType(leaveSocial),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.socialService
          .leaveSocial(action.social_id)
          .pipe(
            mergeMap(social => of(
              putSnack({ snack: { type: SnackType.INFO, message: 'You left the social!' } }),
              putSocial({ social, id: action.social_id }),
            )),
            catchError(errorCatcher('Failed to leave sail'))
          ),
      ),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  postSocialComment$ = createEffect(
    () => this.actions$.pipe(
      ofType(postSocialComment),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.socialService.postNewComment(action.social_id, action.comment)
          .pipe(
            mergeMap(social => of(
              (action.notify ? putSnack({ snack: { type: SnackType.INFO, message: 'Comment posted' } }) : EMPTY),
              putSocial({ social, id: action.social_id }),
            )),
            catchError(errorCatcher(`Failed to post comment to social: ${action.social_id}`)),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  deleteSocialComment$ = createEffect(
    () => this.actions$.pipe(
      ofType(deleteSocialComment),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.socialService.deleteComment(action.social_id, action.comment_id)
          .pipe(
            mergeMap(social => of(
              (action.notify ? putSnack({ snack: { type: SnackType.INFO, message: 'Comment deleted' } }) : EMPTY),
              putSocial({ social, id: action.social_id }),
            )),
            catchError(errorCatcher(`Failed to delete comment: ${action.comment_id}`)),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  createSocial$ = createEffect(
    () => this.actions$.pipe(
      ofType(createSocial),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.socialService.create(action.social)
          .pipe(
            mergeMap(social => of(
              putSnack({ snack: { type: SnackType.INFO, message: 'Social created!' } }),
              putSocial({ social, id: social.id }),
              goTo({ route: viewSocialRoute(social.id) }),
            )),
            catchError(errorCatcher(`Failed to create social: ${action.social.name}`)),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  updateSocial$ = createEffect(
    () => this.actions$.pipe(
      ofType(updateSocial),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.socialService.update(action.id, action.social)
          .pipe(
            mergeMap(social => of(
              putSocial({ social, id: action.id }),
              ...(action.updateActions || []),
              putSnack({ snack: { type: SnackType.INFO, message: 'Saved' } }),
            )),
            catchError(errorCatcher(`Failed to update social: ${action.id}`)),
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  fetchSocial$ = createEffect(
    () => this.actions$.pipe(
      ofType(fetchSocial),
      tap(() => this.store.dispatch(startLoading())),
      mergeMap(
        action => this.socialService.fetchOne(action.social_id)
          .pipe(
            mergeMap((social) => {
              if (action.notify) {
                return of(
                  putSocial({ social, id: action.social_id }),
                  putSnack({ snack: { type: SnackType.INFO, message: 'Fetched social.' } }),
                );
              }
              return of(putSocial({ social, id: action.social_id }));
            }),
            catchError(errorCatcher(`Failed to fetch social ${action.social_id}`))
          )),
      tap(() => this.store.dispatch(finishLoading())),
    ),
  );

  constructor(
    @Inject(Actions) private actions$: Actions,
    @Inject(SocialService) private socialService: SocialService,
    @Inject(Store) private store: Store<any>,
  ) { }
}
