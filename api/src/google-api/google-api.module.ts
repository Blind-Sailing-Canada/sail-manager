import { Module } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import { GoogleEmailService } from './google-email.service';
import { GoogleGroupService } from './google-group.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    GoogleCalendarService,
    GoogleEmailService,
    GoogleGroupService,
  ],
  exports: [
    GoogleCalendarService,
    GoogleEmailService,
    GoogleGroupService,
  ],
})
export class GoogleApiModule {}
