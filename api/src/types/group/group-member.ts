import { PaginatedBase } from '../base/paginated-base';
import { Profile } from '../profile/profile';

interface GroupMemberSchema {
  delivery_settings?: string | null;
  email?: string | null;
  etag?: string | null;
  id?: string | null;
  kind?: string | null;
  role?: string | null;
  status?: string | null;
  type?: string | null;
}

export interface GroupMember {
  member: GroupMemberSchema;
  profile?: Profile
}

export type PaginatedGroupMember = PaginatedBase<GroupMember>
