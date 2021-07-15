import { Base } from '../base/base';
import { Profile } from '../profile/profile';
import { Challenge } from './challenge';

export interface ChallengeParticipant extends Base {
  participant: Profile;
  participantId: string;
  challenge: Challenge;
  challengeId: string;
  finishedAt: Date;
  note: string;
}
