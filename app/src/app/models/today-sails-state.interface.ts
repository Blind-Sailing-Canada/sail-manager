import { Sail } from '../../../../api/src/types/sail/sail';

export interface TodaySailsState {
  [propName: string]: Sail[];
  all: Sail[];
}
