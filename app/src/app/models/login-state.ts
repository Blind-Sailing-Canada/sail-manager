import { Profile } from '../../../../api/src/types/profile/profile';
import { JwtObject } from '../../../../api/src/types/token/jwt-object';

export interface LoginState {
  user: Profile;
  when: Date;
  token: string;
  tokenData: JwtObject;
}
