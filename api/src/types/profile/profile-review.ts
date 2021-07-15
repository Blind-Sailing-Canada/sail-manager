import { ProfileRole } from './profile-role';
import { ProfileStatus } from './profile-status';

export interface ProfileReviewAccess {
  [propName: string]: boolean
}

export interface ProfileReview {
  access: ProfileReviewAccess
  requiredActionId: string
  roles: ProfileRole[]
  status: ProfileStatus
}
