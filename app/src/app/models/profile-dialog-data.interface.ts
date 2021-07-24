import { Profile } from '../../../../api/src/types/profile/profile';
import { ProfileRole } from '../../../../api/src/types/profile/profile-role';

export interface ProfileDialogData {
  profile: Profile;
  type: string | ProfileRole[];
  viewProfile: (id: string) => void;
}
