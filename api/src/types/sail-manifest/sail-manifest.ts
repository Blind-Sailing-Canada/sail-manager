import { Profile } from '../profile/profile';
import { Base } from '../base/base';
import { Sail } from '../sail/sail';
import { SailorRole } from './sailor-role';

export interface SailManifest extends Base {
  attended: boolean;
  guest_of: Profile;
  guest_of_id: string;
  person_name: string;
  profile: Profile;
  profile_id: string;
  sail: Sail;
  sail_id: string;
  sailor_role: SailorRole;
}
