import { Base } from '../base/base';
import { Profile } from '../profile/profile';
import { MediaType } from './media-type';

export interface Media extends Base {
  description: string;
  media_for_id: string;
  media_for_type: string;
  media_type: MediaType;
  posted_by: Profile;
  posted_by_id: string;
  title: string;
  url: string;
}
