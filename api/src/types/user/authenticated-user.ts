import { ProviderUser } from './provider-user';
import { UserEntity } from '../../user/user.entity';

export interface AuthenticatedUser {
  user_entity: UserEntity,
  provider_user: ProviderUser,
}
