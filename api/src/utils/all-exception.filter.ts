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
    const request = ctx.getRequest<Request>();
    const status = exception.status || 500;

    const user = (request as any).user ?  (request as any).user : 'unknown';

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
