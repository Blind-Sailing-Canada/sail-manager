import { SetMetadata } from '@nestjs/common';
import { UserAccessFields } from '../types/user-access/user-access-fields';

export const USER_ACCESS_KEY = 'access';
export const UserAccess = (...access: UserAccessFields[]) => SetMetadata(USER_ACCESS_KEY, access);
