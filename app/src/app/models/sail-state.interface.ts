import { Sail } from '../../../../api/src/types/sail/sail';

export interface ISailState {
  search: Sail[];
  all: ISailMap;
}

export interface ISailMap {
  [propName: string]: Sail;
}
