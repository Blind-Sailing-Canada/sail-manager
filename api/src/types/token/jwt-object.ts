import { ProviderUser } from '../user/provider-user';
import { ProfileRole } from '../profile/profile-role';
import { ProfileStatus } from '../profile/profile-status';
import { Access } from '../user-access/access';

export interface JwtObject {
  access: Access;
  email: string;
  username: string;
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
