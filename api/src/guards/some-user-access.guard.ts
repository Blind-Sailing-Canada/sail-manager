import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtObject } from '../types/token/jwt-object';

@Injectable()
export class SomeUserAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: JwtObject = request.user;

    if (!user) {
      return false;
    }

    const handlerClass = context.getClass();
    const handlerClassRequiredAccess = this.reflector.get<string[]>('access', handlerClass) || [];

    const handler = context.getHandler();
    const handlerRequiredAccess = this.reflector.get<string[]>('access', handler) || [];

    const requiredAccess = handlerClassRequiredAccess.concat(handlerRequiredAccess);

    if (!requiredAccess.length) {
      return true;
    }

    const userAccess = (user.access || {}).access || {};
    const can = requiredAccess.some(access => userAccess[access]);

    return can;
  }
}
