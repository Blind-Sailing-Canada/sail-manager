import { Boat } from '../boat/boat';
import { Profile } from '../profile/profile';
import { SailChecklist } from '../sail-checklist/sail-checklist';
import { SailManifest } from '../sail-manifest/sail-manifest';
import { SailStatus } from './sail-status';
import { SailFeedback } from '../sail-feedback/sail-feedback';
import { SailRequest } from '../sail-request/sail-request';
import { Comment } from '../comment/comment';
import { Media } from '../media/media';
import { CreatedByBase } from '../base/created-by-base';

export interface Sail extends CreatedByBase {
  boat: Boat;
  boat_id: string;
  calendar_id: string;
  calendar_link: string;
  cancel_reason: string;
  cancelled_at: Date;
  cancelled_by: Profile;
  cancelled_by_id: string;
  category: string;
  checklists: SailChecklist[];
  comments: Comment[];
  description: string;
  end_at: Date;
  entity_number: number;
  entity_type: string;
  feedback: SailFeedback[];
  is_payment_free: boolean;
  manifest: SailManifest[];
  max_occupancy: number;
  name: string;
  pictures: Media[];
  sail_request: SailRequest;
  sail_request_id: string;
  start_at: Date;
  status: SailStatus;
}
