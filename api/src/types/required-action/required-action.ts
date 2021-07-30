import { Profile } from '../profile/profile';
import { RequiredActionType } from './required-action-type';
import { RequiredActionStatus } from './required-action-status';
import { Base } from '../base/base';

export interface RequiredAction extends Base {
  actionable_id: string;
  actionable_type: string;
  assigned_by: Profile;
  assigned_by_id: string;
  assigned_to: Profile
  assigned_to_id: string;
  due_date: Date;
  required_action_type: RequiredActionType;
  title: string;
  details: string;
  status: RequiredActionStatus;
}
