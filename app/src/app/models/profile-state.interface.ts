import { Profile } from '../../../../api/src/types/profile/profile';

export interface IProfileState {
  profiles: IProfileMap;
  totalCount: number;
}

export interface IProfileMap {
  [propName: string]: Profile;
}
