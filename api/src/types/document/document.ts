import { Base } from '../base/base';
import { Comment } from '../comment/comment';
import { Profile } from '../profile/profile';

export interface Document extends Base {
  author: Profile;
  author_id: string;
  comments: Comment[];
  description: string;
  documentable_id: string;
  documentable_type: string;
  fileLocation: string;
  title: string;
}
