import { Base } from '../base/base';
import { Profile } from '../profile/profile';
import { Setting } from './setting';

export interface Settings extends Base {
  profile_id: string;
  profile: Profile;
  settings: Setting;
}
