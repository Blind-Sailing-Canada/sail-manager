import { Profile } from '../../../../api/src/types/profile/profile';
import { Sail } from '../../../../api/src/types/sail/sail';

export interface AddSailorDialogData {
  sail: Sail;
  fetchAvailableSailor: (sailorName: string) => void;
  availableSailors: Profile[];
  addSailor: (sailor: Profile) => void;
}
