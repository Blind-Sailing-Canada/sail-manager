import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler
} from '@nestjs/common';
import { Request } from 'express';
import * as Sentry from '@sentry/node';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request: Request = context.getArgByIndex(0);

    try {
      if ([
        'POST',
        'PATCH'
      ].includes(request.method) && !request.originalUrl.includes('/upload/')) {
        console.log('post_patch_request_log', request.method, request.url, request.originalUrl, request.body);
      }
      Sentry.captureEvent({
        level: 'log',
        message: `API SERVER: ${request.method} ${request.url}`,
        request:{
          url: request.url,
          method: request.method,
          headers: request.headers as { [propName: string]: string },
        },
        user: (request as any).user,
      });
    } catch (error) {
      console.error('error in LoggingInterceptor');
      console.error(error);
    }

    return next.handle();
  }
}
