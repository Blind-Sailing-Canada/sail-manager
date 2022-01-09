import {
  createAction,
  props,
} from '@ngrx/store';
import { Document } from '../../../../../api/src/types/document/document';

export enum DOCUMENT_ACTION_TYPES {
  CREATE = '[Document] Create',
  FETCH_MANY = '[Document] Fetch Many',
  FETCH_ONE = '[Document] Fetch One',
  PUT_MANY = '[Document] Put Many',
  PUT_ONE = '[Document] Put One',
  RESET = 'Reset',
  UPDATE = '[Document] Update',
}

export const createDocument = createAction(DOCUMENT_ACTION_TYPES.CREATE, props<{ document: Partial<Document>; notify?: boolean }>());
export const fetchDocument = createAction(DOCUMENT_ACTION_TYPES.FETCH_ONE, props<{ id: string }>());
export const fetchDocuments = createAction(DOCUMENT_ACTION_TYPES.FETCH_MANY, props<{ notify?: boolean }>());
export const putDocument = createAction(DOCUMENT_ACTION_TYPES.PUT_ONE, props<{ id: string; document: Document }>());
export const putDocuments = createAction(DOCUMENT_ACTION_TYPES.PUT_MANY, props<{ documents: Document[] }>());
export const resetDocuments = createAction(DOCUMENT_ACTION_TYPES.RESET);
export const updateDocument = createAction(
  DOCUMENT_ACTION_TYPES.UPDATE, props<{ id: string; document: Partial<Document>; notify?: boolean }>());
