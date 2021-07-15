import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtObject } from '../types/token/jwt-object';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: JwtObject = request.user;

    if (!user) {
      return false;
    }

    const handlerClass = context.getClass();
    const handlerClassRequiredRoles = this.reflector.get<string[]>('roles', handlerClass) || [];

    const handler = context.getHandler();
    const handlerRequiredRoles = this.reflector.get<string[]>('roles', handler) || [];

    const requiredRoles = handlerClassRequiredRoles.concat(handlerRequiredRoles);

    if (!requiredRoles.length) {
      return true;
    }

    const userRoles = user.roles || [];
    const can = userRoles.some(role => requiredRoles.includes(role));

    return can;
  }
}
