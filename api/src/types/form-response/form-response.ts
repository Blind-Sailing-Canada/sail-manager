import { Base } from '../base/base';
import { Profile } from '../profile/profile';

export interface FormResponse extends Base {
  email: string
  form_id: string
  form_name: string
  name: string
  profile: Profile
  profile_id: string
  response: string
}
