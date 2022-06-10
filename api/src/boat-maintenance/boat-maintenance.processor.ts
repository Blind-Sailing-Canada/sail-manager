import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';
import { CommentEntity } from '../comment/comment.entity';
import { BoatMaintenanceEmail } from '../email/boat-maintenance.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { ProfileEntity } from '../profile/profile.entity';
import { BoatMaintenanceNewCommentJob } from '../types/boat-maintenance/boat-maintenance-new-comment-job';
import { BoatMaintenanceNewRequestJob } from '../types/boat-maintenance/boat-maintenance-new-request-job';
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
  async sendNewMaintenanceEmail(job: Job<BoatMaintenanceNewRequestJob>) {
    const request = await BoatMaintenanceEntity.findOneOrFail({ where: { id: job.data.maintenance_id } });
    const fleetManagers =  await ProfileEntity.fleetManagers();

    if (!fleetManagers.length) {
      return;
    }

    const emailInfo = this.boatMaintenanceEmail.newMaintenanceRequestEmail(request);
    emailInfo.to = fleetManagers.map(manager => manager.email);

    return this.emailService.sendToEmail(emailInfo);
  }

  @Process('update-request')
  async sendUpdateMaintenanceEmail(job: Job<BoatMaintenanceNewRequestJob>) {
    const request = await BoatMaintenanceEntity.findOneOrFail({ where: { id: job.data.maintenance_id } });
    const fleetManagers =  await ProfileEntity.fleetManagers();

    if (!fleetManagers.length) {
      return;
    }

    const emailInfo = this.boatMaintenanceEmail.updatedMaintenanceRequestEmail(request);
    emailInfo.to = fleetManagers.map(manager => manager.email);

    return this.emailService.sendToEmail(emailInfo);
  }

  @Process('new-comment')
  async sendNewCommentEmail(job: Job<BoatMaintenanceNewCommentJob>) {
    try {
      const request = await BoatMaintenanceEntity.findOneOrFail({ where: { id: job.data.maintenance_id } });
      const comment = await CommentEntity.findOneOrFail({ where: { id: job.data.comment_id } });
      const fleetManagers =  await ProfileEntity.fleetManagers();

      if (!fleetManagers.length) {
        return;
      }

      const emailInfo = this.boatMaintenanceEmail.newMaintenanceRequestCommentEmail(request,comment);

      emailInfo.bcc.push(...fleetManagers.map(manager => manager.email));

      return this.emailService.sendBccEmail(emailInfo);
    } catch (error) {
      this.logger.error(error);
    }

  }
}
