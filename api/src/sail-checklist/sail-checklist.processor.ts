import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';
import { SailChecklistEmail } from '../email/sail-checklist.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { ProfileEntity } from '../profile/profile.entity';
import { SailChecklistUpdateJob } from '../types/sail-checklist/sail-checklist-update-job';
import { BaseQueueProcessor } from '../utils/base-queue-processor';
import { SailChecklistEntity } from './sail-checklist.entity';

@Processor('sail-checklist')
export class SailChecklistProcessor extends BaseQueueProcessor {

  constructor(
    private sailChecklistEmail: SailChecklistEmail,
    private emailService: GoogleEmailService,
  ) {
    super();
  }

  @Process('sail-checklist-update')
  async sendUpdateSailEmail(job: Job<SailChecklistUpdateJob>) {
    try {
      const checklist = await SailChecklistEntity.findOneOrFail({
        where: { id: job.data.sail_checklist_id },
        relations: [
          'sail',
          'sail.manifest',
          'sail.boat',
          'sail.boat.checklist'
        ],
      });
      const fleetManagers = await ProfileEntity.fleetManagers();
      const coordinators = await ProfileEntity.coordinators();

      const email = this.sailChecklistEmail.checklistUpdateEmail(checklist, fleetManagers, coordinators);
      await this.emailService.sendBccEmail(email);

    } catch (error) {
      this.logger.error(error);
    }
  }

}
