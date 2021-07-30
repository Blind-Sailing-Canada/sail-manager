import { ProfileRole } from '../profile/profile-role';
import { ProfileStatus } from '../profile/profile-status';
import { UserAccess } from '../user-access/user-access';

export interface JwtObject {
  email: string;
  exp?: number;
  access?: UserAccess;
  expireAt: number;
  iat?: number;
  profile_id: string;
  provider: string;
  roles: ProfileRole[];
  status: ProfileStatus;
  sub: string;
  userId?: string;
  username: string;
  uid?: string;
  id?: string;
}
