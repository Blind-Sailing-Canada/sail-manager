import { SailChecklist } from '../../../../api/src/types/sail-checklist/sail-checklist';

export interface ISailChecklistState {
  search: SailChecklist[];
  all: ISailChecklistMap;
}

export interface ISailChecklistMap {
  [propName: string]: SailChecklist;
}
