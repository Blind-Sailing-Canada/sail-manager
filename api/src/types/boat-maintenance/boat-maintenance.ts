import { Boat } from '../boat/boat';
import { Comment } from '../comment/comment';
import { Profile } from '../profile/profile';
import { BoatMaintenanceStatus } from './boat-maintenance-status';
import { Base } from '../base/base';
import { Sail } from '../sail/sail';
import { Media } from '../media/media';

export interface BoatMaintenance extends Base {
  boat: Boat;
  boat_id: string;
  comments: Comment[];
  entity_type: string;
  request_details: string;
  requested_by: Profile;
  requested_by_id: string;
  resolution_details: string;
  service_details: string;
  serviced_at: Date;
  resolved_by: Profile;
  resolved_by_id: string;
  sail: Sail;
  sail_id: string;
  status: BoatMaintenanceStatus;
  maintenance_sail_id: string;
  maintenance_sail: Sail;
  pictures: Media[];
}
