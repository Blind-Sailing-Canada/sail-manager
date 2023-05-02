import { Profile } from '../profile/profile';
import { Base } from './base';

export interface CreatedByBase extends Base {
  created_by_id: string
  created_by: Profile
}
