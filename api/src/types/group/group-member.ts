import { PaginatedBase } from '../base/paginated-base';
import { Profile } from '../profile/profile';
import { admin_directory_v1 } from 'googleapis';

export interface GroupMember {
  member: admin_directory_v1.Schema$Member;
  profile?: Profile
}

export type PaginatedGroupMember = PaginatedBase<GroupMember>
