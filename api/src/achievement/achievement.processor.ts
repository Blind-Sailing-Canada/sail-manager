import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';
import { AchievementEmail } from '../email/achiement.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { BaseQueueProcessor } from '../utils/base-queue-processor';
import { AchievementEntity } from './achievement.entity';

@Processor('achievement')
export class AchievementProcessor extends BaseQueueProcessor {

  constructor(
    private achievementEmail: AchievementEmail,
    private emailService: GoogleEmailService
  ) {
    super();
  }

  @Process('new-achievement')
  async sendNewAttendee(job: Job) {
    const achiement = await AchievementEntity.findOneOrFail(job.data.achievementId);
    const email = this.achievementEmail.newAchievement(achiement);

    return this.emailService.sendToEmail(email);
  }
}
