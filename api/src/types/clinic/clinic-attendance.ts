import { Base } from '../base/base';
import { Profile } from '../profile/profile';
import { Clinic } from './clinic';

export interface ClinicAttendance extends Base {
  attendant: Profile;
  attendantId: string;
  clinic: Clinic;
  clinicId: string;
  finishedAt: Date;
  note: string;
}
