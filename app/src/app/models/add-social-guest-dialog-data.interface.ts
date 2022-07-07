import { Profile } from '../../../../api/src/types/profile/profile';
import { Social } from '../../../../api/src/types/social/social';

export interface AddSocialGuestDialogData {
  addGuest: (name: string, guest_of_id: string) => void;
  guestName: string;
  guest_of_id: string;
  social: Social;
  usersOnSocial: Profile[];
}
