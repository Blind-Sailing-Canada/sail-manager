import { Profile } from '../profile/profile';
import { Base } from '../base/base';
import { Comment } from '../comment/comment';
import { Media } from '../media/media';
import { SocialStatus } from './social-status';
import { SocialManifest } from '../social-manifest/social-manifest';

export interface Social extends Base {
  address: string;
  calendar_id: string;
  calendar_link: string;
  cancel_reason: string;
  cancelled_at: Date;
  cancelled_by: Profile;
  cancelled_by_id: string;
  comments: Comment[];
  description: string;
  end_at: Date;
  entity_number: number;
  entity_type: string;
  manifest: SocialManifest[];
  max_attendants: number;
  name: string;
  pictures: Media[];
  start_at: Date;
  status: SocialStatus;
}
