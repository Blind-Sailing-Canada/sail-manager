import { Boat } from '../boat/boat';
import { Profile } from '../profile/profile';
import { SailChecklist } from '../sail-checklist/sail-checklist';
import { SailManifest } from '../sail-manifest/sail-manifest';
import { Base } from '../base/base';
import { SailStatus } from './sail-status';
import { SailFeedback } from '../sail-feedback/sail-feedback';
import { SailRequest } from '../sail-request/sail-request';
import { Comment } from '../comment/comment';
import { Media } from '../media/media';

export interface Sail extends Base {
  boat: Boat;
  boatId: string;
  calendarId: string;
  calendarLink: string;
  cancelReason: string;
  cancelledAt: Date;
  cancelledBy: Profile;
  cancelledById: string;
  checklists: SailChecklist[];
  comments: Comment[];
  description: string;
  end: Date;
  entityNumber: number;
  entityType: string;
  feedback: SailFeedback[];
  manifest: SailManifest[];
  maxOccupancy: number;
  name: string;
  pictures: Media[];
  sailRequest: SailRequest;
  sailRequestId: string;
  start: Date;
  status: SailStatus;
}
