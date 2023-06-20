import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtObject } from '../types/token/jwt-object';
import { RequiredActionEntity } from './required-action.entity';

@Injectable()
export class RequiredActionOwnerGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: JwtObject = request.user;

    if (!user || !user.profile_id) {
      return false;
    }

    const actionId = request.params.id;

    if (!actionId) {
      return false;
    }

    const action = await RequiredActionEntity.findOne({ where: {
      id: actionId,
      assigned_to_id: user.profile_id
    } });

    if (!action) {
      return false;
    }

    return true;
  }
}

