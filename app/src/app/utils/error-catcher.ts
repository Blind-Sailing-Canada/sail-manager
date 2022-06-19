import { of } from 'rxjs';
import { Action } from '@ngrx/store/src/models';
import { SnackType } from '../models/snack-state.interface';
import { putSnack } from '../store/actions/snack.actions';
import { finishLoading } from '../store/actions/app.actions';

export const errorCatcher = (
  userFriendlyMessage: string,
  actionsToDispatch: Action[] = [],
  actionsToDispatchWithError: any = null,
  notify: boolean = true) => (error) => {
  console.error('Error catcher caught and error: VVV ERROR BELOW VVV');
  console.dir(error);

  return of(
    ...(actionsToDispatch || []),
    ...(actionsToDispatchWithError ? actionsToDispatchWithError(error) : []),
    finishLoading(),
    notify && putSnack({ snack: { type: SnackType.ERROR, message: userFriendlyMessage } }),
  );
};
