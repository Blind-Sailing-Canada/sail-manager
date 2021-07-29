import { Profile } from '../profile/profile';
import { Base } from '../base/base';

export interface User extends Base {
  profile: Profile;
  profileId: string;
  originalProfileId: string,
  linkedByProfileId: string,
  provider: string;
  providerUserId: string;
}
