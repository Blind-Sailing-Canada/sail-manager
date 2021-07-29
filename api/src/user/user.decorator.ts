import {
  createParamDecorator, ExecutionContext
} from '@nestjs/common';
import { JwtObject } from '../types/token/jwt-object';

export const User = createParamDecorator (
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as JwtObject;
  }
);
