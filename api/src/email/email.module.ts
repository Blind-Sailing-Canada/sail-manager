import { Module } from '@nestjs/common';
import { AchievementEmail } from './achiement.email';
import { BoatMaintenanceEmail } from './boat-maintenance.email';
import { ChallengeEmail } from './challenge.email';
import { ClinicEmail } from './clinic.email';
import { ProfileEmail } from './profile.email';
import { SailRequestEmail } from './sail-request.email';
import { SailEmail } from './sail.email';

@Module({
  exports: [
    AchievementEmail,
    BoatMaintenanceEmail,
    ChallengeEmail,
    ClinicEmail,
    ProfileEmail,
    SailEmail,
    SailRequestEmail,
  ],
  providers: [
    AchievementEmail,
    BoatMaintenanceEmail,
    ChallengeEmail,
    ClinicEmail,
    ProfileEmail,
    SailEmail,
    SailRequestEmail,
  ],
})
export class EmailModule { }
