import { Base } from '../base/base';
import { Profile } from '../profile/profile';
import { ClinicAttendance } from './clinic-attendance';
import { ClinicStatus } from './clinic-status';

export interface Clinic extends Base {
  attendance: ClinicAttendance[];
  badge: string;
  description: string;
  end_date: Date;
  instructor: Profile;
  instructor_id: string;
  max_occupancy: number;
  name: string;
  start_date: Date;
  status: ClinicStatus;
}
