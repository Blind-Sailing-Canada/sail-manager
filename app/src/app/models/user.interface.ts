import { Profile } from '../../../../api/src/types/profile/profile';
import { ProfileRole } from '../../../../api/src/types/profile/profile-role';
import { Access } from '../../../../api/src/types/user-access/access';

export interface User {
  access: Access;
  profile: Profile;
  roles: ProfileRole[];
}
