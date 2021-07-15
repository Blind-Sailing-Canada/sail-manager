import { Clinic } from '../../../../api/src/types/clinic/clinic';

export interface ClinicsState {
  [propName: string]: Clinic;
}
