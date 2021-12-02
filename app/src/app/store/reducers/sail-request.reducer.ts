import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { ISailRequestState } from '../../models/sail-request-state.interface';
import {
  putSailRequest,
  putSailRequests,
  resetSailRequest,
} from '../actions/sail-request.actions';

const initialState = {} as ISailRequestState;

const reducerHandler = createReducer(
  initialState,
  on(resetSailRequest, () => initialState),
  on(putSailRequest, (state, action) => Object.assign({}, state, { [action.id]: action.sailRequest })),
  on(putSailRequests, (state, action) => {
    const map = action
      .sailRequests
      .reduce(
        (reducer, sailRequest) => {
          reducer[sailRequest.id] = sailRequest;
          return reducer;
        },
        {},
      );

    return Object.assign({}, state, map);
  })
);

export const sailRequestReducer = (state: ISailRequestState | undefined, action: Action) => reducerHandler(state, action);
