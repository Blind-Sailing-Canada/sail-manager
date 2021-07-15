import { Profile } from '../../../../api/src/types/profile/profile';

export interface ProfileDialogData {
  profile: Profile;
  type: string;
  viewProfile: (id: string) => void;
}
