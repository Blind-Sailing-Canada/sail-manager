import { Sail } from '../sail/sail';
import { Profile } from '../profile/profile';
import { SailRequestStatus } from './sail-request-status';
import { Base } from '../base/base';
import { SailRequestInterest } from '../sail-request-interest/sail-request-interest';

export interface SailRequest extends Base {
  details: string;
  entity_number: number;
  interest: SailRequestInterest[];
  requested_by: Profile;
  requested_by_id: string;
  sail: Sail;
  sail_id: string;
  status: SailRequestStatus;
}
