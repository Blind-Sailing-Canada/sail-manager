import { ChallengeParticipant } from '../challenge/challenge-participant';
import { ClinicAttendance } from '../clinic/clinic-attendance';
import { RequiredAction } from '../required-action/required-action';
import { SailManifest } from '../sail-manifest/sail-manifest';
import { ProfileRole } from './profile-role';
import { ProfileStatus } from './profile-status';
import { ExpiresBase } from '../base/expires-base';
import { Achievement } from '../achievement/achievement';
import { UserAccess } from '../user-access/user-access';
import { SailChecklist } from '../sail-checklist/sail-checklist';

export interface Profile extends ExpiresBase {
  access: UserAccess;
  achievements: Achievement[];
  bio: string;
  challenges: ChallengeParticipant[];
  clinics_attendances: ClinicAttendance[];
  deleted_at: Date;
  email: string;
  expires_at: Date;
  last_login: Date;
  name: string;
  phone: string;
  photo: string;
  required_actions: RequiredAction[];
  roles: ProfileRole[];
  sail_checklists: SailChecklist[];
  sail_manifests: SailManifest[];
  status: ProfileStatus;
}
