import { Profile } from '../../../../api/src/types/profile/profile';

export interface FindUserDialogData {
  searchUsers: (queryString: string) => void;
  complete: (user: Profile) => void;
  users: Profile[];
}
