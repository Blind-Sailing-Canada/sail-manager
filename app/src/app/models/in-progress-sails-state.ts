import { Sail } from '../../../../api/src/types/sail/sail';

export interface InProgressSailsState {
  [propName: string]: Sail[];
  all: Sail[];
}
