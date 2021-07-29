import { Profile } from '../../../../api/src/types/profile/profile';
import { ProfileLink } from '../../../../api/src/types/user/profile-link';

export interface LinkAccountsDialogData {
  account: Profile;
  fetchAccounts: (anemOrEmail: string) => void;
  accounts: Profile[];
  linkAccounts: (profileA: Profile, profileB: Profile, linkType: ProfileLink) => void;
}
