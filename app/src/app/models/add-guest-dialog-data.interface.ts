import { Profile } from '../../../../api/src/types/profile/profile';
import { Sail } from '../../../../api/src/types/sail/sail';

export interface AddGuestDialogData {
  addGuest: (name: string, email: string, guest_of_id: string) => void;
  guestName: string;
  guest_of_id: string;
  guest_email: string;
  sail: Sail;
  usersOnSail: Profile[];
}
