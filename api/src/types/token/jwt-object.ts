import { ProviderUser } from '../user/provider-user';
import { ProfileRole } from '../profile/profile-role';
import { ProfileStatus } from '../profile/profile-status';
import { UserAccess } from '../user-access/user-access';

export interface JwtObject {
  access: UserAccess;
  email: string;
  expire_time: number;
  iat: number; // issued at date
  profile_id: string; // ProfileEntity id
  provider: string;
  provider_user: ProviderUser;
  roles: ProfileRole[];
  status: ProfileStatus;
  sub: string, //// ProfileEntity id
  user_id: string; // UserEntity id
}
