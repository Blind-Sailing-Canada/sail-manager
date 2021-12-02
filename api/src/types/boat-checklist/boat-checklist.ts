import { Base } from '../base/base';
import { Boat } from '../boat/boat';
import { BoatChecklistItem } from './boat-checklist-item';

export interface BoatChecklist extends Base {
  boatId: string
  boat: Boat
  items: BoatChecklistItem[]
}
