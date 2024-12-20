import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';
import { CommentEntity } from '../comment/comment.entity';
import { SocialEmail } from '../email/social.email';
import { GoogleCalendarService } from '../google-api/google-calendar.service';
import { GoogleEmailService } from '../google-api/google-email.service';
import { ProfileEntity } from '../profile/profile.entity';
import { SocialCancelJob } from '../types/social/social-cancel-job';
import { SocialJoinJob } from '../types/social/social-join-job';
import { SocialLeaveJob } from '../types/social/social-leave-job';
import { SocialNewCommentJob } from '../types/social/social-new-comment-job';
import { SocialNewJob } from '../types/social/social-new-job';
import { SocialUpdateJob } from '../types/social/social-update-job';
import { BaseQueueProcessor } from '../utils/base-queue-processor';
import { SocialEntity } from './social.entity';

@Processor('social')
export class SocialProcessor extends BaseQueueProcessor {

  constructor(
    private socialEmail: SocialEmail,
    private calendarService: GoogleCalendarService,
    private emailService: GoogleEmailService) {
    super();
  }

  @Process('new-social')
  async sendNewSocialEmail(job: Job<SocialNewJob>) {
    try {
      const social = await SocialEntity.findOneOrFail({ where: { id: job.data.social_id } });

      await this.calendarService.createSocialEvent(social, job.data.message);
    } catch (error) {
      this.logger.error(`failed to create calendar event for social ${job.data.social_id}:${job.data.message}`);
      this.logger.error(error);
    }
  }

  @Process('update-social')
  async sendUpdateSocialEmail(job: Job<SocialUpdateJob>) {
    try {
      const social = await SocialEntity.findOneOrFail({ where: { id: job.data.social_id } });

      await this.calendarService.updateSocialEvent(social, job.data.message);
    } catch (error) {
      this.logger.error(`failed to update calendar event for social ${job.data.social_id}:${job.data.message}`);
      this.logger.error(error);
    }
  }

  @Process('join-social')
  async sendJoinSocialEmail(job: Job<SocialJoinJob>) {
    try {
      const social = await SocialEntity.findOneOrFail({ where: { id: job.data.social_id } });
      const profile = await ProfileEntity.findOneOrFail({ where: { id: job.data.profile_id } });

      await this.calendarService.joinSocialEvent(social, profile);
    } catch (error) {
      this.logger.error(`failed to join calendar event for social ${job.data.social_id}:${job.data.profile_id}`);
      this.logger.error(error);
    }
  }

  @Process('leave-social')
  async sendLeaveSocialEmail(job: Job<SocialLeaveJob>) {
    try {
      const social = await SocialEntity.findOneOrFail({ where: { id: job.data.social_id } });
      const profile = await ProfileEntity.findOneOrFail({ where: { id: job.data.profile_id } });

      await this.calendarService.leaveSocialEvent(social, profile);
    } catch (error) {
      this.logger.error(`failed to leave calendar event for social ${job.data.social_id}:${job.data.profile_id}`);
      this.logger.error(error);
    }
  }

  @Process('cancel-social')
  async sendCancelSocialEmail(job: Job<SocialCancelJob>) {
    const social = await SocialEntity.findOneOrFail({ where: { id: job.data.social_id } });
    const socialCoordinators = await ProfileEntity.coordinators();

    const emailInfo = this.socialEmail.cancelSocialEmail(social, socialCoordinators);

    this.emailService.sendBccEmail(emailInfo);
    this.calendarService.cancelSocialEvent(social);
  }

  @Process('new-comment')
  async sendNewCommentEmail(job: Job<SocialNewCommentJob>) {
    try {
      const social = await SocialEntity.findOneOrFail({ where: { id: job.data.social_id } });
      const comment = await CommentEntity.findOneOrFail({ where: { id: job.data.comment_id } });
      const socialCoordinators = await ProfileEntity.coordinators();

      const emailInfo = this.socialEmail.newCommentEmail(social, comment, socialCoordinators);

      await this.emailService.sendBccEmail(emailInfo);
    } catch (error) {
      this.logger.error(`failed to send social comment email for social ${job.data.social_id}:${job.data.comment_id}`);
      this.logger.error(error);
    }
  }
}
