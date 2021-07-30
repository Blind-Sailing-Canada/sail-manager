import { Base } from '../base/base';
import { Profile } from '../profile/profile';

export interface Achievement extends Base {
  profile_id: string;
  profile: Profile;
  name: string;
  description: string;
  badge: string;
  achievement_type: string;
  achievement_id: string;
}
