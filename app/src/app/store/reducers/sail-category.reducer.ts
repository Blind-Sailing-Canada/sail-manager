import {
  Action,
  createReducer,
  on,
} from '@ngrx/store';
import { SailCategoryState } from '../../models/sail-category-state.interface';
import { putSailCategories, putSailCategory, removeSailCategory, resetSailCategory } from '../actions/sail-category.actions';

const initialState = {} as SailCategoryState;

const reducerHandler = createReducer(
  initialState,
  on(resetSailCategory, () => initialState),
  on(putSailCategory, (state, action) => Object.assign({}, state, { [action.id]: action.category })),
  on(putSailCategories, (state, action) => {
    const map = action
      .categories
      .reduce(
        (reducer, category) => {
          reducer[category.id] = category;
          return reducer;
        },
        {},
      );

    return Object.assign({}, state, map);
  }),
  on(removeSailCategory, (state, action) => {
    const newState = { ...state };
    delete newState[action.id];

    return newState;
  })
);

export const sailCategoryReducer = (state: SailCategoryState | undefined, action: Action) => reducerHandler(state, action);
