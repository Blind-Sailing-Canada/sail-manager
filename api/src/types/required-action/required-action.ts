import { Profile } from '../profile/profile';
import { RequiredActionType } from './required-action-type';
import { RequiredActionStatus } from './required-action-status';
import { Base } from '../base/base';

export interface RequiredAction extends Base {
  actionableId: string;
  actionableType: string;
  assignedBy: Profile;
  assignedById: string;
  assignedTo: Profile
  assignedToId: string;
  dueDate: Date;
  requiredActionType: RequiredActionType;
  title: string;
  details: string;
  status: RequiredActionStatus;
}
