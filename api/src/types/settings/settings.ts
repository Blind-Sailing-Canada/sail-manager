import { Base } from '../base/base';
import { Profile } from '../profile/profile';
import { Setting } from './setting';

export interface Settings extends Base {
  profileId: string;
  profile: Profile;
  settings: Setting;
}
