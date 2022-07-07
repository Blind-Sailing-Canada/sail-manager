import { Profile } from '../../../../api/src/types/profile/profile';
import { Social } from '../../../../api/src/types/social/social';

export interface AddSocialAttendantDialogData {
  addAttendant: (profile: Profile) => void;
  fetchProfile: (name: string) => void;
  profiles: Profile[];
  social: Social;
}
