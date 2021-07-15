export enum SnackType {
  ERROR = 0,
  INFO,
}

export interface Snack {
  type: SnackType;
  message: string;
  options?: any;
}

export interface ISnackState {
  snacks: Snack[];
}
