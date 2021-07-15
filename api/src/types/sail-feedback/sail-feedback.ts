import { Base } from '../base/base';
import { Sail } from '../sail/sail';

export interface SailFeedback extends Base {
  feedback: string;
  rating: number;
  sail: Sail;
  sailId: string;
}
