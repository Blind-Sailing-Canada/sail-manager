import { Module } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import { GoogleEmailService } from './google-email.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    GoogleCalendarService,
    GoogleEmailService,
  ],
  exports: [
    GoogleCalendarService,
    GoogleEmailService,
  ],
})
export class GoogleApiModule {}
