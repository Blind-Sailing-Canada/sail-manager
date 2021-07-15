import { Request } from 'express';
import { JwtObject } from '../token/jwt-object';

export interface AuthenticatedRequest extends Request {
  user: JwtObject
}
