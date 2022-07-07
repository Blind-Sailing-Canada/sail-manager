import { UserAccessFields } from './user-access-fields';

export type Access = Partial<Record<UserAccessFields, boolean>>;
