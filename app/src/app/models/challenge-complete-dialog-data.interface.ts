import { Challenge } from '../../../../api/src/types/challenge/challenge';
import { Profile } from '../../../../api/src/types/profile/profile';

export interface ChallengeCompleteDialogData {
  challenge: Challenge;
  challenger: Profile;
  result: string;
  submit: (challengeId: string, challengerId: string, result: string) => void;
}
