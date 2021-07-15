import {
  OnGlobalQueueError, OnQueueError, OnQueueFailed
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import * as Sentry from '@sentry/node';

export class BaseQueueProcessor {
  protected readonly logger: Logger;

  constructor() {
    this.logger = new Logger(this.constructor.name);
  }

  @OnQueueError()
  onQueueErrror(error: Error) {
    this.logger.log('OnQueueError HANDLER');
    Sentry.captureException(error);
  }

  @OnQueueFailed()
  onError(job: Job, error) {
    this.logger.log('OnQueueFailed HANDLER');
    Sentry.captureException(error);
    this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
  }

  @OnGlobalQueueError()
  onGlobalError(job: Job, error) {
    this.logger.log('OnGlobalQueueError HANDLER');
    Sentry.captureException(error);
    this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
  }
}
