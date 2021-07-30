import { Base } from '../base/base';
import { SailRequest } from '../sail-request/sail-request';
import { Profile } from '../profile/profile';

export interface SailRequestInterest extends Base {
  profile: Profile;
  profile_id: string;
  sail_request: SailRequest;
  sail_request_id: string;
}
