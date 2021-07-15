import { Profile } from '../../../../api/src/types/profile/profile';
import { JwtObject } from '../../../../api/src/types/token/jwt-object';

export interface ILoginState {
  user: Profile;
  when: Date;
  token: string;
  tokenData: JwtObject;
}
