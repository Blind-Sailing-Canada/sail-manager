import { Base } from '../base/base';
import { Sail } from '../sail/sail';
import { BoatInstructions } from '../boat-instructions/boat-instructions';
import { BoatStatus } from './boat-status';

export interface Boat extends Base {
  ballast: string;
  beam: string;
  calendarResourceId: string;
  draft: string;
  hullType: string;
  instructions: BoatInstructions[];
  jibSailArea: string;
  loa: string;
  lwl: string;
  mainSailArea: string;
  material: string;
  maxOccupancy: number;
  name: string;
  phrf: string;
  rig: string;
  sails: Sail[]
  status: BoatStatus;
  wiki: string;
  pictures: string[];
}
