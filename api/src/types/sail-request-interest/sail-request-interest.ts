import { Base } from '../base/base';
import { SailRequest } from '../sail-request/sail-request';
import { Profile } from '../profile/profile';

export interface SailRequestInterest extends Base {
  profile: Profile;
  profileId: string;
  sailRequest: SailRequest;
  sailRequestId: string;
}
