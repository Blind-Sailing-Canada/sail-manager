import {
  createReducer,
  on,
  Action,
} from '@ngrx/store';
import { DocumentState } from '../../models/document.state';
import { putDocument, putDocuments, resetDocuments } from '../actions/document.actions';

const initialState = {} as DocumentState;

const reducerHandler = createReducer(
  initialState,
  on(resetDocuments, () => initialState),
  on(putDocument, (state, action) => Object.assign({}, state, { [action.id]: action.document })),
  on(putDocuments, (state, action) => {
    const map = action
      .documents
      .reduce(
        (reducer, boat) => {
          reducer[boat.id] = boat;
          return reducer;
        },
        {},
      );

    return Object.assign({}, state, map);
  })
);

export const documentReducer = (state: DocumentState | undefined, action: Action) => reducerHandler(state, action);
