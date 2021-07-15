import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { RequiredAction } from '../../../../../api/src/types/required-action/required-action';
import { RequiredActionsState } from '../../models/required-actions.state';
import { putRequiredActions, putRequiredAction, resetRequiredActions } from '../actions/required-actions.actions';

const initialState: RequiredActionsState = {
  fetching: {},
  actions: {},
};

const reducerHandler = createReducer(
  initialState,
  on(resetRequiredActions, () => initialState),
  on(putRequiredActions, (state, action) => {
    const existingActions = Object.assign({}, state.actions);
    const newActions = action
      .actions
      .reduce(
        (red, ra) => {
          red[ra.id] = ra as RequiredAction;
          return red;
        },
        existingActions,
      );
    return Object.assign({}, state, { actions: newActions } as RequiredActionsState);
  }),
  on(putRequiredAction, (state, action) => {
    const existingActions = Object.assign({}, state.actions);
    existingActions[action.actionId] = action.action as RequiredAction;
    return Object.assign({}, state, { actions: existingActions } as RequiredActionsState);
  }),
);

export function requiredActionsReducer(state: RequiredActionsState, action: Action) {
  return reducerHandler(state, action);
}
