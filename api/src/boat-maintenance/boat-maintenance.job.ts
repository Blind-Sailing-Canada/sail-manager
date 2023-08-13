import {
  Injectable, Logger
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BoatMaintenanceEmail } from '../email/boat-maintenance.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { ProfileEntity } from '../profile/profile.entity';
import { BoatMaintenanceEntity } from './boat-maintenance.entity';

@Injectable()
export class BoatMaintenanceJob {
  private logger: Logger;

  constructor(
    private maintenanceEmail: BoatMaintenanceEmail,
    private emailService: GoogleEmailService
  ) {
    this.logger = new Logger(BoatMaintenanceJob.name);
  }

  @Cron('0 0 14 8,11,2,5 *') //At 00:00 on day-of-month 14 in August, November, February, and May.
  async outstandingMaintenanceRequest() {
    this.logger.log('starting outstandingMaintenanceRequest job');

    const requests = await BoatMaintenanceEntity
      .getRepository()
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.boat', 'boat')
      .where('request.status IN (\'new\', \'in progress\') and request.created_at < NOW() - INTERVAL \'60 days\'')
      .orderBy('request.created_at', 'ASC')
      .getMany();

    const bccTo: Set<string> = new Set<string>();
    const admins = await ProfileEntity.admins();
    const fleetManagers = await ProfileEntity.fleetManagers();

    admins?.forEach(admin => bccTo.add(admin.email));
    fleetManagers?.forEach(manager => bccTo.add(manager.email));

    const emailInfo = this.maintenanceEmail.outstandingMaintenanceRequestEmail(requests);
    emailInfo.bcc = Array.from(bccTo);

    this.logger.log(`outstandingMaintenanceRequest email ${emailInfo}`);

    await this.emailService.sendToEmail(emailInfo);
  }

}
