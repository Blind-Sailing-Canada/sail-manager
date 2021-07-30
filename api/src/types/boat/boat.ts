import { Base } from '../base/base';
import { Sail } from '../sail/sail';
import { BoatInstructions } from '../boat-instructions/boat-instructions';
import { BoatStatus } from './boat-status';

export interface Boat extends Base {
  ballast: string;
  beam: string;
  calendar_resource_id: string;
  draft: string;
  hull_type: string;
  instructions: BoatInstructions[];
  jib_sail_area: string;
  loa: string;
  lwl: string;
  main_sail_area: string;
  material: string;
  max_occupancy: number;
  name: string;
  phrf: string;
  rig: string;
  sails: Sail[]
  status: BoatStatus;
  wiki: string;
  pictures: string[];
}
