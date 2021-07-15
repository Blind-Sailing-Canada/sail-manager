import { Profile } from '../profile/profile';
import { Base } from '../base/base';

export interface User extends Base {
  profile: Profile;
  profileId: string;
  provider: string;
  providerUserId: string;
}
