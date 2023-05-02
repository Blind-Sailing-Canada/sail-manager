import { CreatedByBase } from '../base/created-by-base';
import { Comment } from '../comment/comment';
import { Media } from '../media/media';
import { ChallengeParticipant } from './challenge-participant';
import { ChallengeStatus } from './challenge-status';

export interface Challenge extends CreatedByBase {
  badge: string;
  comments: Comment[];
  description: string;
  end_date: Date;
  max_occupancy: number;
  name: string;
  participants: ChallengeParticipant[];
  pictures: Media[];
  start_date: Date;
  status: ChallengeStatus;
}
