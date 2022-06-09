import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler
} from '@nestjs/common';
import { Request } from 'express';
import * as Sentry from '@sentry/node';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request: Request = context.getArgByIndex(0);

    Sentry.captureEvent({
      level: 'log',
      message: `API SERVER: ${request.method} ${request.url}`,
      request:{
        url: request.url,
        method: request.method,
        headers: request.headers as {[propName: string]: string},
      },
      user: (request as any).user,
    });

    return next.handle();
  }
}
