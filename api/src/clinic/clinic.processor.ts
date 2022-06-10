import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';
import { ClinicEmail } from '../email/clinic.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { ProfileEntity } from '../profile/profile.entity';
import { ClinicAttendeeNewJob } from '../types/clinic/clinic-attendee-new-job';
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
  async sendNewAttendee(job: Job<ClinicAttendeeNewJob>) {
    const clinic = await ClinicEntity.findOne({ where: { id: job.data.clinic_id } });
    const attendee = await ProfileEntity.findOne({ where: { id: job.data.profile_id } });

    const email = await this.clinicEmail.newAttendee(clinic, attendee);

    await this.emailService.sendBccEmail(email);
  }
}
