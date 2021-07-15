import { Base } from '../base/base';
import { Comment } from '../comment/comment';
import { Media } from '../media/media';
import { ChallengeParticipant } from './challenge-participant';
import { ChallengeStatus } from './challenge-status';

export interface Challenge extends Base {
  badge: string;
  comments: Comment[];
  description: string;
  endDate: Date;
  maxOccupancy: number;
  name: string;
  participants: ChallengeParticipant[];
  pictures: Media[];
  startDate: Date;
  status: ChallengeStatus;
}
