import {
  Injectable, PipeTransform
} from '@nestjs/common';
import validator from 'validator';
import { BoatMaintenance } from '../../types/boat-maintenance/boat-maintenance';

@Injectable()
export class MaintenanceUpdateSanitizer implements PipeTransform {
  transform(value: BoatMaintenance) {
    return Object
      .keys(value)
      .reduce((maintenance, key: keyof BoatMaintenance) => {
        switch(key) {
          case 'service_details':
          case 'request_details':
          case 'resolution_details':
            maintenance[key] = validator.escape(value[key] ?? '');
            break;
          default:
            maintenance[key] = value[key] as any;
        }

        return maintenance;
      }, {} as BoatMaintenance);
  }
}
