import { Boat } from '../boat/boat';
import { Comment } from '../comment/comment';
import { Profile } from '../profile/profile';
import { BoatMaintenanceStatus } from './boat-maintenance-status';
import { Base } from '../base/base';
import { Sail } from '../sail/sail';
import { Media } from '../media/media';

export interface BoatMaintenance extends Base {
  boat: Boat;
  boatId: string;
  comments: Comment[];
  entityType: string;
  requestDetails: string;
  requestedBy: Profile;
  requestedById: string;
  resolutionDetails: string;
  serviceDetails: string;
  servicedAt: Date;
  resolvedBy: Profile;
  resolvedById: string;
  sail: Sail;
  sailId: string;
  status: BoatMaintenanceStatus;
  pictures: Media[];
}
