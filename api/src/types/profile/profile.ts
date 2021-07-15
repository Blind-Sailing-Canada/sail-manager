import { ChallengeParticipant } from '../challenge/challenge-participant';
import { ClinicAttendance } from '../clinic/clinic-attendance';
import { RequiredAction } from '../required-action/required-action';
import { SailManifest } from '../sail-manifest/sail-manifest';
import { ProfileRole } from './profile-role';
import { ProfileStatus } from './profile-status';
import { ExpiresBase } from '../base/expires-base';
import { Achievement } from '../achievement/achievement';
import { UserAccess } from '../user-access/user-access';

export interface Profile extends ExpiresBase {
  access: UserAccess;
  achievements: Achievement[];
  bio: string;
  challenges: ChallengeParticipant[];
  clinicsAttendances: ClinicAttendance[];
  email: string;
  expiresAt: Date;
  name: string;
  phone: string;
  photo: string;
  requiredActions: RequiredAction[];
  roles: ProfileRole[];
  sailManifests: SailManifest[];
  status: ProfileStatus;
}
