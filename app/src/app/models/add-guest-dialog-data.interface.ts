import { Profile } from '../../../../api/src/types/profile/profile';
import { Sail } from '../../../../api/src/types/sail/sail';

export interface AddGuestDialogData {
  addGuest: (name: string, guestOfId: string) => void;
  guestName: string;
  guestOfId: string;
  sail: Sail;
  usersOnSail: Profile[];
}
