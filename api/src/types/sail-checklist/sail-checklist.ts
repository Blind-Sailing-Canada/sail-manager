import { Base } from '../base/base';
import { Sail } from '../sail/sail';
import { BilgeState } from './bilge-state';
import { FireExtinguisherState } from './fire-exstinguisher-state';
import { FlaresState } from './flare-state';
import { FuelState } from './fuel-state';
import { SailChecklistType } from './sail-checklist-type';

export interface SailChecklist extends Base {
  bilge: BilgeState;
  checklistType: SailChecklistType;
  comments: string;
  fireExtinguisher: FireExtinguisherState;
  flares: FlaresState;
  fuel: FuelState;
  sail: Sail;
  sailDestination: string;
  sailId: string;
  signedByCrew: boolean;
  signedBySkipper: boolean;
  weather: string;
}
