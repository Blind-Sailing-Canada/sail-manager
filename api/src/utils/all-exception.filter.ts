import {
  Request,
  Response
} from 'express';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { JwtObject } from '../types/token/jwt-object';

type RequestWithUser = Request & { user?: JwtObject, original_user?: JwtObject }

@Catch()
export class AllExceptionFilter implements ExceptionFilter {

  private logger: Logger;
  private sendToSentry = Sentry
    .Handlers
    .errorHandler({ shouldHandleError() {
      return true;
    } });

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithUser>();
    const status = exception.status || 500;

    const user = request.user || request.original_user || 'unknown';

    const errorMessage = JSON.stringify(
      {
        user,
        message: exception.message || exception,
        urlPath: request.originalUrl,
      },
      undefined,
      2
    );

    this.logger.error(errorMessage, exception.stack);

    this.sendToSentry(exception, request, response, () => true);

    if (response.headersSent) {
      return;
    }

    response.status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message: exception.message,
        path: request.url,
      });
  }
}
