import { Base } from '../base/base';
import { Profile } from '../profile/profile';

export interface SavedQuery extends Base {
  name: string;
  query: string;
  created_by_id: string;
  created_by: Profile;
}
