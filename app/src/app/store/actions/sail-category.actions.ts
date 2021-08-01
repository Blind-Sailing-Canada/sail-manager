import {
  createAction,
  props,
} from '@ngrx/store';
import { SailCategory } from '../../../../../api/src/types/sail/sail-category';

export enum SAIL_CATEGORY_ACTION_TYPES {
  CREATE = '[Sail Category] Create',
  DELETE = '[Sail Category] Delete',
  FETCH_MANY = '[Sail Category] Fetch Many',
  PUT_MANY = '[Sail Category] Put Many',
  PUT_ONE = '[Sail Category] Put One',
  REMOVE_ONE = '[Sail Category] Remove One',
  RESET = 'Reset',
}

export const createSailCategory = createAction(SAIL_CATEGORY_ACTION_TYPES.CREATE, props<{ category: Partial<SailCategory> }>());
export const deleteSailCategory = createAction(SAIL_CATEGORY_ACTION_TYPES.DELETE, props<{ id: string, notify?: boolean }>());
export const fetchSailCategories = createAction(SAIL_CATEGORY_ACTION_TYPES.FETCH_MANY, props<{ notify?: boolean }>());
export const putSailCategories = createAction(SAIL_CATEGORY_ACTION_TYPES.PUT_MANY, props<{ categories: SailCategory[] }>());
export const putSailCategory = createAction(SAIL_CATEGORY_ACTION_TYPES.PUT_ONE, props<{ id: string, category: SailCategory }>());
export const removeSailCategory = createAction(SAIL_CATEGORY_ACTION_TYPES.REMOVE_ONE, props<{ id: string }>());
export const resetSailCategory = createAction(SAIL_CATEGORY_ACTION_TYPES.RESET);
