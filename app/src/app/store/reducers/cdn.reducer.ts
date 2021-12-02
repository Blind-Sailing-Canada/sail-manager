import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { ICDNState } from '../../models/cdn-state.interface';
import {
  CDN_ACTION_STATE,
  deletedFile,
  deleteError,
  finishUploading,
  resetCDN,
  startUploading,
  uploadError,
  uploadProgress,
} from '../actions/cdn.actions';

const initialState: ICDNState = {
};

const reducerHandler = createReducer(
  initialState,
  on(resetCDN, () => initialState),
  on(startUploading, (state, action) => Object.assign({}, state, { [action.fileName]: { state: CDN_ACTION_STATE.UPLOADING } })),
  on(deletedFile, (state, action) => {
    const previousValue = state[action.filePath] || {};
    const newValue = {
      [action.filePath]: {
        ...previousValue,
        state: CDN_ACTION_STATE.DELETED,
      },
    };
    return Object
      .assign(
        {},
        state,
        newValue,
      );
  }),
  on(finishUploading, (state, action) => {
    const previousValue = state[action.fileName] || {};
    const newValues = {
      [action.fileName]: {
        ...previousValue,
        state: CDN_ACTION_STATE.UPLOADED,
        url: action.url,
      },
    };
    return Object
      .assign(
        {},
        state,
        newValues,
      );
  }),
  on(uploadProgress, (state, action) => {
    const previousValue = state[action.fileName] || {};
    return Object.assign({}, state, { [action.fileName]: { ...previousValue, progress: action.progress } });
  }),
  on(
    uploadError,
    (state, action) => {
      const previousValue = state[action.fileName] || {};
      return Object.assign(
        {},
        state,
        {
          [action.fileName]: {
            ...previousValue,
            state: CDN_ACTION_STATE.ERROR,
            error: {
              error: action.error,
              message: action.message,
            },
          },
        },
      );
    }
  ),
  on(
    deleteError,
    (state, action) => {
      const previousValue = state[action.filePath] || {};
      return Object.assign(
        {},
        state,
        {
          [action.filePath]: {
            ...previousValue,
            state: CDN_ACTION_STATE.ERROR,
            error: {
              error: action.error,
              message: action.message,
            },
          },
        },
      );
    }
  )
);

export const cdnReducer = (state: ICDNState | undefined, action: Action) => reducerHandler(state, action);
