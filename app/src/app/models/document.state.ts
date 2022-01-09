import { Document } from '../../../../api/src/types/document/document';

export interface DocumentState {
  [document_id: string]: Document;
}
