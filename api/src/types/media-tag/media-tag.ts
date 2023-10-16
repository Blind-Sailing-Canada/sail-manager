import { Base } from '../base/base';
import { Media } from '../media/media';
import { Profile } from '../profile/profile';

export interface MediaTag extends Base {
  media_id: string;
  media: Media;
  profile_id: string;
  profile: Profile;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}
