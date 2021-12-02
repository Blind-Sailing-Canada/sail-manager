import { Base } from '../base/base';
import { Profile } from '../profile/profile';
import { Sail } from '../sail/sail';
import { SailChecklistType } from './sail-checklist-type';

export interface SailChecklist extends Base {
  checklist: Map<string, string>;
  checklist_type: SailChecklistType;
  comments: string;
  sail: Sail;
  sail_destination: string;
  sail_id: string;
  signed_by_crew: boolean;
  signed_by_skipper: boolean;
  submitted_by: Profile;
  submitted_by_id: string;
  weather: string;
}
