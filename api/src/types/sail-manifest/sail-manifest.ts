import { Profile } from '../profile/profile';
import { Base } from '../base/base';
import { Sail } from '../sail/sail';
import { SailorRole } from './sailor-role';

export interface SailManifest extends Base {
  attended: boolean;
  personName: string;
  profile: Profile;
  profileId: string;
  sail: Sail;
  sailId: string;
  sailorRole: SailorRole;
  guestOfId: string;
  guestOf: Profile;
}
