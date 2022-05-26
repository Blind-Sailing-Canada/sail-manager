import {
  Injectable, PipeTransform
} from '@nestjs/common';
import validator from 'validator';
import { BoatMaintenance } from '../../types/boat-maintenance/boat-maintenance';

@Injectable()
export class MaintenanceUpdateSanitizer implements PipeTransform {
  transform(value: BoatMaintenance) {
    const {
      boat_id, request_details, resolution_details, status, requested_by_id, service_details,
    } = value;

    const updateDTO = {
      boat_id,
      request_details,
      requested_by_id,
      resolution_details,
      service_details,
      status,
    };

    const keys = Object.keys(updateDTO).filter(key => updateDTO[key] !== undefined);

    return keys.reduce((maintenance, key) => {
      maintenance[key] =  validator.escape(updateDTO[key]);
      return maintenance;
    }, {} as BoatMaintenance);
  }
}
