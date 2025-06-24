import { ProfileRole } from '../profile/profile-role';
import { ProfileStatus } from '../profile/profile-status';
import { Access } from '../user-access/access';

export interface ProviderUser {
  access?: Access;
  bio?: string;
  email: string;
  id: string
  name: string;
  phone?: string;
  photo?: string;
  provider: string;
  roles?: ProfileRole[];
  status?: ProfileStatus;
}
