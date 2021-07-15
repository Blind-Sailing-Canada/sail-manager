import { RequiredAction } from '../../../../api/src/types/required-action/required-action';
export interface RequiredActions {
  [propName: string]: RequiredAction;
}

export interface RequiredActionsFetching {
  [propName: string]: boolean;
}

export interface RequiredActionsState {
  fetching: RequiredActions;
  actions: RequiredActions;
}
