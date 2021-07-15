import { UserAccessFields } from './user-access-fields';

export const DefaultUserAccess = Object
  .values(UserAccessFields)
  .reduce((red, field) => {
    red[field] = false;
    return red;
  }, {});
