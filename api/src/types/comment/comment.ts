import { Base } from '../base/base';
import { Profile } from '../profile/profile';

export interface Comment extends Base {
  author: Profile;
  author_id: string;
  comment: string;
  commentable_id: string;
  commentable_type: string;
}
