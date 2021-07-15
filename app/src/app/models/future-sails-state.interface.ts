import { Sail } from '../../../../api/src/types/sail/sail';

export interface FutureSailsState {
  [propName: string]: Sail[];
  all: Sail[];
}
