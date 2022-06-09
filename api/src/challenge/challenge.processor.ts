import {
  Process, Processor
} from '@nestjs/bull';
import { Job } from 'bull';
import { CommentEntity } from '../comment/comment.entity';
import { ChallengeEmail } from '../email/challenge.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { ProfileEntity } from '../profile/profile.entity';
import { BaseQueueProcessor } from '../utils/base-queue-processor';
import { ChallengeEntity } from './challenge.entity';

@Processor('challenge')
export class ChallengeProcessor extends BaseQueueProcessor {

  constructor(
    private challengeEmail: ChallengeEmail,
    private emailService: GoogleEmailService
  ) {
    super();
  }

  @Process('new-attendee')
  async sendNewAttendee(job: Job) {
    const challenge = await ChallengeEntity.findOneOrFail({ where: { id: job.data.challenge_id } });
    const attendee = await ProfileEntity.findOneOrFail({ where: { id: job.data.profile_id } });

    const email = await this.challengeEmail.newAttendee(challenge, attendee);

    await this.emailService.sendBccEmail(email);
  }

  @Process('new-comment')
  async sendNewComment(job: Job) {
    const challenge = await ChallengeEntity.findOneOrFail({ where: { id: job.data.challenge_id } });
    const comment = await CommentEntity.findOneOrFail({ where: { id: job.data.commentId } });

    const email = await this.challengeEmail.newCommentEmail(challenge, comment);

    await this.emailService.sendBccEmail(email);
  }
}
