import { JwtObject } from '../../../../api/src/types/token/jwt-object';

export const decodeJwt = (token: string): JwtObject => JSON.parse(atob(token.split('.')[1]));
