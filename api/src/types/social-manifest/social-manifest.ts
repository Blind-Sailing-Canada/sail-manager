import { Profile } from '../profile/profile';
import { Base } from '../base/base';
import { Social } from '../social/social';

export interface SocialManifest extends Base {
  attended: boolean;
  guest_of: Profile;
  guest_of_id: string;
  person_name: string;
  profile: Profile;
  profile_id: string;
  social: Social;
  social_id: string;
}
