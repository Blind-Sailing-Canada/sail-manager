import { Base } from '../base/base';
import { Profile } from '../profile/profile';
import { Challenge } from './challenge';

export interface ChallengeParticipant extends Base {
  participant: Profile;
  participant_id: string;
  challenge: Challenge;
  challenge_id: string;
  finished_at: Date;
  note: string;
}
