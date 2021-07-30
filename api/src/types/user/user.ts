import { Profile } from '../profile/profile';
import { Base } from '../base/base';

export interface User extends Base {
  profile: Profile;
  profile_id: string;
  original_profile_id: string,
  linked_by_profile_id: string,
  provider: string;
  provider_user_id: string;
}
