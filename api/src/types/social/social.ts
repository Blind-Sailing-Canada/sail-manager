import { Profile } from '../profile/profile';
import { Comment } from '../comment/comment';
import { Media } from '../media/media';
import { SocialStatus } from './social-status';
import { SocialManifest } from '../social-manifest/social-manifest';
import { CreatedByBase } from '../base/created-by-base';

export interface Social extends CreatedByBase {
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
