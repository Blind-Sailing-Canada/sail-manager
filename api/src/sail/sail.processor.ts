import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';
import { CommentEntity } from '../comment/comment.entity';
import { SailEmail } from '../email/sail.email';
import { GoogleCalendarService } from '../google-api/google-calendar.service';
import { GoogleEmailService } from '../google-api/google-email.service';
import { ProfileEntity } from '../profile/profile.entity';
import { SailCancelJob } from '../types/sail/sail-cancel-job';
import { SailJoinJob } from '../types/sail/sail-join-job';
import { SailLeaveJob } from '../types/sail/sail-leave-job';
import { SailNewCommentJob } from '../types/sail/sail-new-comment-job';
import { SailNewJob } from '../types/sail/sail-new-job';
import { SailUpdateJob } from '../types/sail/sail-update-job';
import { BaseQueueProcessor } from '../utils/base-queue-processor';
import { SailEntity } from './sail.entity';
import * as Sentry from '@sentry/node';

@Processor('sail')
export class SailProcessor extends BaseQueueProcessor {

  constructor(
    private sailEmail: SailEmail,
    private calendarService: GoogleCalendarService,
    private emailService: GoogleEmailService) {
    super();
  }

  @Process('new-sail')
  async sendNewSailEmail(job: Job<SailNewJob>) {
    try {
      const sail = await SailEntity.findOneOrFail({ where: { id: job.data.sail_id } });

      await this.calendarService.createSailEvent(sail, job.data.message);
    } catch (error) {
      this.logger.error(error);
      Sentry.captureException(error);
    }
  }

  @Process('update-sail')
  async sendUpdateSailEmail(job: Job<SailUpdateJob>) {
    try {
      const sail = await SailEntity.findOneOrFail({ where: { id: job.data.sail_id } });

      await this.calendarService.updateSailEvent(sail, job.data.message);
    } catch (error) {
      this.logger.error(error);
      Sentry.captureException(error);
    }
  }

  @Process('join-sail')
  async sendJoinSailEmail(job: Job<SailJoinJob>) {
    try {
      const sail = await SailEntity.findOneOrFail({ where: { id: job.data.sail_id } });
      const profile = await ProfileEntity.findOneOrFail({ where: { id: job.data.profile_id } });

      await this.calendarService.joinSailEvent(sail, profile);
    } catch (error) {
      this.logger.error(error);
      Sentry.captureException(error);
    }
  }

  @Process('leave-sail')
  async sendLeaveSailEmail(job: Job<SailLeaveJob>) {
    try {
      const sail = await SailEntity.findOneOrFail({ where: { id: job.data.sail_id } });
      const profile = await ProfileEntity.findOneOrFail({ where: { id: job.data.profile_id } });

      await this.calendarService.leaveSailEvent(sail, profile);
    } catch (error) {
      this.logger.error(error);
      Sentry.captureException(error);
    }
  }

  @Process('cancel-sail')
  async sendCancelSailEmail(job: Job<SailCancelJob>) {
    const sail = await SailEntity.findOneOrFail({ where: { id: job.data.sail_id } });
    const sailCoordinators = await ProfileEntity.coordinators();

    const emailInfo = this.sailEmail.cancelSailEmail(sail, sailCoordinators);

    this.emailService.sendBccEmail(emailInfo);
    this.calendarService.cancelSailEvent(sail);
  }

  @Process('new-comment')
  async sendNewCommentEmail(job: Job<SailNewCommentJob>) {
    try {
      const sail = await SailEntity.findOneOrFail({ where: { id: job.data.sail_id } });
      const comment = await CommentEntity.findOneOrFail({ where: { id: job.data.comment_id } });
      const sailCoordinators = await ProfileEntity.coordinators();

      const emailInfo = this.sailEmail.newCommentEmail(sail, comment, sailCoordinators);

      await this.emailService.sendBccEmail(emailInfo);
    } catch (error) {
      this.logger.error(error);
      Sentry.captureException(error);
    }
  }
}
