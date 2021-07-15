import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { ISnackState } from '../../models/snack-state.interface';
import {
  putSnack,
  removeSnack,
  resetSnacks,
} from '../actions/snack.actions';

const initialState = {
  snacks: [],
} as ISnackState;

const reducerHandler = createReducer(
  initialState,
  on(resetSnacks, () => initialState),
  on(putSnack, (state, action) => {
    return Object.assign({}, state, { snacks: state.snacks.concat(action.snack) } as ISnackState);
  }),
  on(removeSnack, (state, action) => {
    const copy = [].concat(state.snacks);

    copy.splice(action.index, 1);

    return Object.assign({}, state, { snacks: copy } as ISnackState);

  })
);

export function snackReducer(state: ISnackState | undefined, action: Action) {
  return reducerHandler(state, action);
}
