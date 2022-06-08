import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';
import { CommentEntity } from '../comment/comment.entity';
import { SailEmail } from '../email/sail.email';
import { GoogleCalendarService } from '../google-api/google-calendar.service';
import { GoogleEmailService } from '../google-api/google-email.service';
import { ProfileEntity } from '../profile/profile.entity';
import { BaseQueueProcessor } from '../utils/base-queue-processor';
import { SailEntity } from './sail.entity';

@Processor('sail')
export class SailProcessor extends BaseQueueProcessor {

  constructor(
    private sailEmail: SailEmail,
    private calendarService: GoogleCalendarService,
    private emailService: GoogleEmailService) {
    super();
  }

  @Process('new-sail')
  async sendNewSailEmail(job: Job) {
    const sail = await SailEntity.findOneOrFail({ where: { id: job.data.sail_id } });

    await this.calendarService.createSailEvent(sail, job.data.message);
  }

  @Process('update-sail')
  async sendUpdateSailEmail(job: Job) {
    const sail = await SailEntity.findOneOrFail({ where: { id: job.data.sail_id } });

    await this.calendarService.updateSailEvent(sail, job.data.message);
  }

  @Process('join-sail')
  async sendJoinSailEmail(job: Job) {
    const sail = await SailEntity.findOneOrFail({ where: { id: job.data.sail_id } });
    const profile = await ProfileEntity.findOneOrFail({ where: { id: job.data.profile_id } });

    await this.calendarService.joinSailEvent(sail, profile);
  }

  @Process('leave-sail')
  async sendLeaveSailEmail(job: Job) {
    const sail = await SailEntity.findOneOrFail({ where: { id: job.data.sail_id } });
    const profile = await ProfileEntity.findOneOrFail({ where: { id: job.data.profile_id } });

    await this.calendarService.leaveSailEvent(sail, profile);
  }

  @Process('cancel-sail')
  async sendCancelSailEmail(job: Job) {
    const sail = await SailEntity.findOneOrFail({ where: { id: job.data.sail_id } });
    const sailCoordinators = await ProfileEntity.coordinators();

    const emailInfo = this.sailEmail.cancelSailEmail(sail, sailCoordinators);

    this.emailService.sendBccEmail(emailInfo);
    this.calendarService.cancelSailEvent(sail);
  }

  @Process('new-comment')
  async sendNewCommentEmail(job: Job) {
    const sail = await SailEntity.findOneOrFail({ where: { id: job.data.sail_id } });
    const comment = await CommentEntity.findOneOrFail({ where: { id: job.data.commentId } });
    const sailCoordinators = await ProfileEntity.coordinators();

    const emailInfo = this.sailEmail.newCommentEmail(sail, comment, sailCoordinators);

    await this.emailService.sendBccEmail(emailInfo);
  }
}
