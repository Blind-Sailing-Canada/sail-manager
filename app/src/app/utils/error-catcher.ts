import { of } from 'rxjs';
import { Action } from '@ngrx/store/src/models';
import { SnackType } from '../models/snack-state.interface';
import { putSnack } from '../store/actions/snack.actions';

export const errorCatcher = (userFriendlyMessage: string, actionsToDispatch?: Action[], actionsToDispatchWithError?: any) => (error) => {
  console.error('Error catcher caught and error: VVV ERROR DIRED BELOW VVV');
  console.dir(error);

  return of(
    ...(actionsToDispatch || []),
    ...(actionsToDispatchWithError ? actionsToDispatchWithError(error) : []),
    putSnack({ snack: { type: SnackType.ERROR, message: userFriendlyMessage } }),
  );
};
