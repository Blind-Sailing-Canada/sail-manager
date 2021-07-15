import { Sail } from '../../../../api/src/types/sail/sail';

export interface PastSailsState {
  [propName: string]: Sail[];
  all: Sail[];
}
