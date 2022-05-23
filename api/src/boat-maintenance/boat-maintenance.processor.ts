import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';
import { CommentEntity } from '../comment/comment.entity';
import { BoatMaintenanceEmail } from '../email/boat-maintenance.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { ProfileEntity } from '../profile/profile.entity';
import { BaseQueueProcessor } from '../utils/base-queue-processor';
import { BoatMaintenanceEntity } from './boat-maintenance.entity';

@Processor('boat-maintenance')
export class BoatMaintenanceProcessor extends BaseQueueProcessor {

  constructor(
    private boatMaintenanceEmail: BoatMaintenanceEmail,
    private emailService: GoogleEmailService
  ) {
    super();
  }

  @Process('new-request')
  async sendNewMaintenanceEmail(job: Job) {
    const request = await BoatMaintenanceEntity.findOneOrFail(job.data.maintenanceId);
    const fleetManager =  await ProfileEntity.fleetManager();

    if (!fleetManager) {
      return;
    }

    const emailInfo = this.boatMaintenanceEmail.newMaintenanceRequestEmail(request);
    emailInfo.to = [fleetManager.email];

    return this.emailService.sendToEmail(emailInfo);
  }

  @Process('update-request')
  async sendUpdateMaintenanceEmail(job: Job) {
    const request = await BoatMaintenanceEntity.findOneOrFail(job.data.maintenanceId);
    const fleetManager =  await ProfileEntity.fleetManager();

    if (!fleetManager) {
      return;
    }

    const emailInfo = this.boatMaintenanceEmail.updatedMaintenanceRequestEmail(request);
    emailInfo.to = [fleetManager.email];

    return this.emailService.sendToEmail(emailInfo);
  }

  @Process('new-comment')
  async sendNewCommentEmail(job: Job) {
    try {
      const request = await BoatMaintenanceEntity.findOneOrFail(job.data.maintenanceId);
      const comment = await CommentEntity.findOneOrFail(job.data.commentId);
      const fleetManager =  await ProfileEntity.fleetManager();

      if (!fleetManager) {
        return;
      }

      const emailInfo = this.boatMaintenanceEmail.newMaintenanceRequestCommentEmail(request,comment);

      emailInfo.bcc.push(fleetManager.email);

      return this.emailService.sendBccEmail(emailInfo);
    } catch (error) {
      this.logger.error(error);
    }

  }
}
