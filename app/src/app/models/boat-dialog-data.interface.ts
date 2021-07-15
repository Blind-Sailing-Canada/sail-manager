import { Boat } from '../../../../api/src/types/boat/boat';

export interface BoatDialogData {
  boat: Boat;
  type: string;
  viewBoat: (id: string) => void;
}
