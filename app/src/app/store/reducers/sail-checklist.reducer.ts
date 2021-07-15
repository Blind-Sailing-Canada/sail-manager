import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { ISailChecklistState } from '../../models/sail-checklist-state.interface';
import {
  putSailChecklist,
  resetSailChecklists,
  putSailChecklists,
} from '../actions/sail-checklist.actions';

const initialState = {
  all: {},
  search: [],
} as ISailChecklistState;

const reducerHandler = createReducer(
  initialState,
  on(resetSailChecklists, () => initialState),
  on(putSailChecklists, (state, action) => {
    const newAll = Object
      .assign({}, state.all, action.checklists
        .reduce(
          (red, checklist) => {
            red[checklist.id] = checklist;
            return red;
          },
          {})
      );
    return Object.assign({}, state, { all: newAll } as ISailChecklistState);
  }),
  on(putSailChecklist, (state, action) => {
    const newAll = Object.assign({}, state.all, { [action.id]: action.checklist });
    return Object.assign({}, state, { all: newAll } as ISailChecklistState);
  }),
);

export function sailChecklistReducer(state: ISailChecklistState | undefined, action: Action) {
  return reducerHandler(state, action);
}
