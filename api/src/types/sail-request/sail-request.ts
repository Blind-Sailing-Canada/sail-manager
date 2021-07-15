import { Sail } from '../sail/sail';
import { Profile } from '../profile/profile';
import { SailRequestStatus } from './sail-request-status';
import { Base } from '../base/base';
import { SailRequestInterest } from '../sail-request-interest/sail-request-interest';

export interface SailRequest extends Base {
  details: string;
  entityNumber: number;
  interest: SailRequestInterest[];
  requestedBy: Profile;
  requestedById: string;
  sail: Sail;
  sailId: string;
  status: SailRequestStatus;
}
