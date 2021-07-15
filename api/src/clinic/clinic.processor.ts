import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';
import { ClinicEmail } from '../email/clinic.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { ProfileEntity } from '../profile/profile.entity';
import { BaseQueueProcessor } from '../utils/base-queue-processor';
import { ClinicEntity } from './clinic.entity';

@Processor('clinic')
export class ClinicProcessor extends BaseQueueProcessor {

  constructor(
    private clinicEmail: ClinicEmail,
    private emailService: GoogleEmailService
  ) {
    super();
  }

  @Process('new-attendee')
  async sendNewAttendee(job: Job) {
    const clinic = await ClinicEntity.findOneOrFail(job.data.clinicId);
    const attendee = await ProfileEntity.findOneOrFail(job.data.profileId);

    const email = await this.clinicEmail.newAttendee(clinic, attendee);

    await this.emailService.sendBccEmail(email);
  }
}
