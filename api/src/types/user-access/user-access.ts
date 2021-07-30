import { Base } from '../../types/base/base';
import { Profile } from '../profile/profile';
import { Access } from './access';

export interface UserAccess extends Base {
  access: Access;
  profile: Profile;
  profile_id: string;
}
