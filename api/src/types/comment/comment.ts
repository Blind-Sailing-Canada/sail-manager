import { Base } from '../base/base';
import { Profile } from '../profile/profile';

export interface Comment extends Base {
  author: Profile;
  authorId: string;
  comment: string;
  commentableId: string;
  commentableType: string;
}
