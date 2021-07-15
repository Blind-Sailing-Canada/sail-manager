import { Base } from '../base/base';
import { Profile } from '../profile/profile';
import { MediaType } from './media-type';

export interface Media extends Base {
  description: string;
  mediaForId: string;
  mediaForType: string;
  mediaType: MediaType;
  postedBy: Profile;
  postedById: string;
  title: string;
  url: string;
}
