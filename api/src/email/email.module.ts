import { Module } from '@nestjs/common';
import { AchievementEmail } from './achievement.email';
import { BoatMaintenanceEmail } from './boat-maintenance.email';
import { ChallengeEmail } from './challenge.email';
import { ClinicEmail } from './clinic.email';
import { ProfileEmail } from './profile.email';
import { SailChecklistEmail } from './sail-checklist.email';
import { SailRequestEmail } from './sail-request.email';
import { SailEmail } from './sail.email';
import { SocialEmail } from './social.email';

@Module({
  exports: [
    AchievementEmail,
    BoatMaintenanceEmail,
    ChallengeEmail,
    ClinicEmail,
    ProfileEmail,
    SailChecklistEmail,
    SailEmail,
    SailRequestEmail,
    SocialEmail,
  ],
  providers: [
    AchievementEmail,
    BoatMaintenanceEmail,
    ChallengeEmail,
    ClinicEmail,
    ProfileEmail,
    SailChecklistEmail,
    SailEmail,
    SailRequestEmail,
    SocialEmail,
  ],
})
export class EmailModule { }
