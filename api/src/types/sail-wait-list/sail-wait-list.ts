import { Base } from '../base/base';
import { Profile } from '../profile/profile';
import { Sail } from '../sail/sail';
import { SailWaitListStatus } from './sail-wait-list-status';

export interface SailWaitList extends Base {
  profile: Profile
  profile_id: string
  sail: Sail
  sail_id: string
  status: SailWaitListStatus
}
