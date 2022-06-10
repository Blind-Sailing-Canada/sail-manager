import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';
import { AchievementEmail } from '../email/achievement.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { AchievementNewJob } from '../types/achievement/achievement-new-job';
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
  async sendNewAttendee(job: Job<AchievementNewJob>) {
    const achievement = await AchievementEntity.findOne({ where: { id: job.data.achievement_id } });
    const email = this.achievementEmail.newAchievement(achievement);

    return this.emailService.sendToEmail(email);
  }
}
