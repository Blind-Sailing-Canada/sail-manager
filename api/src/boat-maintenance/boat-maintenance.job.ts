import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BoatMaintenanceEmail } from '../email/boat-maintenance.email';
import { GoogleEmailService } from '../google-api/google-email.service';
import { ProfileEntity } from '../profile/profile.entity';
import { BoatMaintenanceEntity } from './boat-maintenance.entity';

@Injectable()
export class BoatMaintenanceJob {

  constructor(
    private maintenanceEmail: BoatMaintenanceEmail,
    private emailService: GoogleEmailService
  ) {}

  @Cron('0 0 1 2-11/2 *') // At 12:00am on the 1st from every 2nd month from February through November
  async outstandingMaintenanceRequest() {
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

    await this.emailService.sendToEmail(emailInfo);
  }

}
