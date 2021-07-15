import { Challenge } from '../../../../api/src/types/challenge/challenge';

export interface ChallengeState {
  [propName: string]: Challenge;
}
