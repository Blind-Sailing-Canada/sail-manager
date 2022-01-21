import {
  createAction,
  props,
} from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { SailChecklist } from '../../../../../api/src/types/sail-checklist/sail-checklist';

export enum SAIL_CHECKLIST_ACTION_TYPES {
  CREATE = '[Sail Checklist] Create',
  FETCH_ONE = '[Sail Checklist] Fetch One',
  FIND = '[Sail Checklist] Find',
  PUT_ONE = '[Sail Checklist] Put One',
  PUT_MANY = '[Sail Checklist] Put Many',
  RESET = 'Reset',
  UPDATE_ONE = '[Sail Checklist] Update One',
  UPDATE_SAIL_CHECKLISTS = '[Sail Checklist] Update Sail Checklists',
}

export const createSailChecklist = createAction(SAIL_CHECKLIST_ACTION_TYPES.CREATE, props<{ checklist: Partial<SailChecklist> }>());
export const fetchSailChecklist = createAction(
  SAIL_CHECKLIST_ACTION_TYPES.FETCH_ONE, props<{ sail_checklist_id: string; resolve?: boolean; notify?: boolean }>());
export const findSailChecklists = createAction(SAIL_CHECKLIST_ACTION_TYPES.FIND, props<{query: string}>());
export const putSailChecklist = createAction(
  SAIL_CHECKLIST_ACTION_TYPES.PUT_ONE, props<{ sail_checklist_id: string; checklist: Partial<SailChecklist> }>());
export const putSailChecklists = createAction(SAIL_CHECKLIST_ACTION_TYPES.PUT_MANY, props<{ checklists: Partial<SailChecklist>[] }>());
export const resetSailChecklists = createAction(SAIL_CHECKLIST_ACTION_TYPES.RESET);
export const updateSailChecklist = createAction(
  SAIL_CHECKLIST_ACTION_TYPES.UPDATE_ONE,
  props<{ sail_checklist_id: string; checklist: Partial<SailChecklist>; updateActions?: TypedAction<any>[] }>(),
  );
export const updateSailChecklists = createAction(
    SAIL_CHECKLIST_ACTION_TYPES.UPDATE_SAIL_CHECKLISTS,
    props<{ sail_id: string; checklistsData}>(),
  );
