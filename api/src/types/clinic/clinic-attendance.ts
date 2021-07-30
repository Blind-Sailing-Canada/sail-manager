import { Base } from '../base/base';
import { Profile } from '../profile/profile';
import { Clinic } from './clinic';

export interface ClinicAttendance extends Base {
  attendant: Profile;
  attendant_id: string;
  clinic: Clinic;
  clinic_id: string;
  finished_at: Date;
  note: string;
}
