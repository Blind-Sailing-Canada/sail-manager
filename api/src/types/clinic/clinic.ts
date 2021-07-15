import { Base } from '../base/base';
import { Profile } from '../profile/profile';
import { ClinicAttendance } from './clinic-attendance';
import { ClinicStatus } from './clinic-status';

export interface Clinic extends Base {
  attendance: ClinicAttendance[];
  badge: string;
  description: string;
  endDate: Date;
  instructor: Profile;
  instructorId: string;
  maxOccupancy: number;
  name: string;
  startDate: Date;
  status: ClinicStatus;
}
