import { Base } from '../base/base';
import { Profile } from '../profile/profile';

export interface Achievement extends Base {
  profileId: string;
  profile: Profile;
  name: string;
  description: string;
  badge: string;
  achievementType: string;
  achievementId: string;
}
