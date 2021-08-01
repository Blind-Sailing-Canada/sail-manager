import { Base } from '../base/base';
import { Profile } from '../profile/profile';
import { Sail } from '../sail/sail';
import { BilgeState } from './bilge-state';
import { FireExtinguisherState } from './fire-exstinguisher-state';
import { FlaresState } from './flare-state';
import { FuelState } from './fuel-state';
import { SailChecklistType } from './sail-checklist-type';

export interface SailChecklist extends Base {
  bilge: BilgeState;
  checklist_type: SailChecklistType;
  comments: string;
  fire_extinguisher: FireExtinguisherState;
  flares: FlaresState;
  fuel: FuelState;
  sail: Sail;
  sail_destination: string;
  sail_id: string;
  signed_by_crew: boolean;
  signed_by_skipper: boolean;
  submitted_by: Profile;
  submitted_by_id: string;
  weather: string;
}
