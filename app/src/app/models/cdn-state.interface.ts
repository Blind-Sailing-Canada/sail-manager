import { CDN_ACTION_STATE } from '../store/actions/cdn.actions';

export interface ICDNFileState {
  state?: CDN_ACTION_STATE;
  progress?: number;
  url?: string;
  error?: {
    error: Error;
    message: string;
  };
}
export interface ICDNState {
  [propName: string]: ICDNFileState;
}
