import {
  calendar_v3, google
} from 'googleapis';
import {
  Injectable, Logger
} from '@nestjs/common';
import { Sail } from '../types/sail/sail';
import { SailEntity } from '../sail/sail.entity';
import { DOMAIN } from '../auth/constants';
import { toLocalDate } from '../utils/date.util';
import { SailorRole } from '../types/sail-manifest/sailor-role';
import { Profile } from '../types/profile/profile';
import * as Sentry from '@sentry/node';
import { Social } from '../types/social/social';
import { SocialEntity } from '../social/social.entity';

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID_SAILS;

@Injectable()
export class GoogleCalendarService {
  private calendar: calendar_v3.Calendar;
  private connected = false;
  private readonly logger = new Logger(GoogleCalendarService.name);

  constructor() {
    this.connect();
  }

  private async connect() {
    this.logger.log('calendar service connect()');

    const jwtClient = new google.auth.JWT(
      {
        subject: CALENDAR_ID,
        email: process.env.GOOGLE_API_CLIENT_EMAIL,
        key: process.env.GOOGLE_API_PRIVATE_KEY.replace(/\\n/g, '\n'),
        keyId: process.env.GOOGLE_API_PRIVATE_KEY_ID,
        scopes: [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.readonly',
          'https://www.googleapis.com/auth/calendar.events',
          'https://www.googleapis.com/auth/calendar.events.readonly',
        ],
      }
    );

    await jwtClient
      .authorize()
      .catch(error => {
        this.logger.error('failed to authorize google calendar in connect()');
        this.logger.error(error);
        Sentry.captureException(error);
        throw error;
      });

    this.calendar = google.calendar({
      version: 'v3',
      auth: jwtClient,
    });

    this.connected = true;

  }

  async createSocialEvent(social: Social, message: string) {
    if (social.calendar_id) {
      return this.updateSocialEvent(social, message);
    }

    if (!this.connected) {
      await this.connect();
    }

    const event = this.socialEvent(social, message);

    this.logger.log('event' + JSON.stringify(event, null, 2));

    const createdEvent = await this.calendar
      .events
      .insert({
        calendarId: CALENDAR_ID,
        requestBody: event,
        sendNotifications: true,
      })
      .then(response => response.data)
      .catch((error) => {
        Sentry.captureMessage('event' + JSON.stringify(event, null, 2));
        throw error;
      });

    return SocialEntity
      .update(social.id, {
        calendar_id: createdEvent.id,
        calendar_link: createdEvent.htmlLink,
      });
  }

  async createSailEvent(sail: Sail, message: string) {
    if (sail.calendar_id) {
      return this.updateSailEvent(sail, message);
    }

    if (!this.connected) {
      await this.connect();
    }

    const event = this.sailEvent(sail, message);

    this.logger.log('event' + JSON.stringify(event, null, 2));

    const createdEvent = await this.calendar
      .events
      .insert({
        calendarId: CALENDAR_ID,
        requestBody: event,
        sendNotifications: true,
      })
      .then(response => response.data)
      .catch((error) => {
        Sentry.captureMessage('event' + JSON.stringify(event, null, 2));
        throw error;
      });

    return SailEntity
      .update(sail.id, {
        calendar_id: createdEvent.id,
        calendar_link: createdEvent.htmlLink,
      });
  }

  async cancelSailEvent(sail: Sail) {
    if (!this.connected) {
      await this.connect();
    }

    if (!sail.calendar_id) {
      this.logger.log(`cancelSailEvent: no calendar event for sail ${sail.id}`);
      return;
    }

    await SailEntity.update({ id: sail.id }, {
      calendar_id: null,
      calendar_link: null,
    });

    return this.calendar
      .events
      .delete({
        calendarId: CALENDAR_ID,
        sendNotifications: true,
        eventId: sail.calendar_id,
      });
  }

  async cancelSocialEvent(social: Social) {
    if (!this.connected) {
      await this.connect();
    }

    if (!social.calendar_id) {
      this.logger.log(`cancelSailEvent: no calendar event for social ${social.id}`);
      return;
    }

    await SocialEntity.update({ id: social.id }, {
      calendar_id: null,
      calendar_link: null,
    });

    return this.calendar
      .events
      .delete({
        calendarId: CALENDAR_ID,
        sendNotifications: true,
        eventId: social.calendar_id,
      });
  }

  async updateSocialEvent(social: Social, message: string) {
    if (!this.connected) {
      await this.connect();
    }

    if (!social.calendar_id) {
      this.logger.log(`updateSailEvent: no calendar event for social ${social.id}`);
      return;
    }

    const event = this.socialEvent(social, message);

    return this.calendar.events.patch({
      calendarId: CALENDAR_ID,
      eventId: social.calendar_id,
      requestBody: event,
      sendUpdates: 'all',
    });
  }

  async updateSailEvent(sail: Sail, message: string) {
    if (!this.connected) {
      await this.connect();
    }

    if (!sail.calendar_id) {
      this.logger.log(`updateSailEvent: no calendar event for sail ${sail.id}`);
      return;
    }

    const event = this.sailEvent(sail, message);

    return this.calendar.events.patch({
      calendarId: CALENDAR_ID,
      eventId: sail.calendar_id,
      requestBody: event,
      sendUpdates: 'all',
    });
  }

  async joinSailEvent(sail: Sail, profile: Profile) {
    if (!this.connected) {
      await this.connect();
    }

    if (!sail.calendar_id) {
      this.logger.log(`joinSailEvent: no calendar event for sail ${sail.id}`);
      return Promise.resolve();
    }

    const existingEvent = await this.calendar
      .events
      .get({
        calendarId: CALENDAR_ID,
        eventId: sail.calendar_id,
      })
      .then(response => response.data);

    const currentAttendees = existingEvent.attendees || [];

    if (currentAttendees.some(attendee => attendee.email === profile.email)) {
      return Promise.resolve();
    }

    const event = this.sailEvent(sail);

    currentAttendees
      .push({
        email: profile.email,
        resource: false,
        displayName: profile.name,
      });

    return this.calendar
      .events
      .patch({
        calendarId: CALENDAR_ID,
        eventId: sail.calendar_id,
        requestBody: event,
        sendUpdates: 'all',
      });
  }

  async joinSocialEvent(social: Social, profile: Profile) {
    if (!this.connected) {
      await this.connect();
    }

    if (!social.calendar_id) {
      this.logger.log(`joinSailEvent: no calendar event for social ${social.id}`);
      return Promise.resolve();
    }

    const existingEvent = await this.calendar
      .events
      .get({
        calendarId: CALENDAR_ID,
        eventId: social.calendar_id,
      })
      .then(response => response.data);

    const currentAttendees = existingEvent.attendees || [];

    if (currentAttendees.some(attendee => attendee.email === profile.email)) {
      return Promise.resolve();
    }

    currentAttendees
      .push({
        email: profile.email,
        resource: false,
        displayName: profile.name,
      });

    return this.calendar
      .events
      .patch({
        calendarId: CALENDAR_ID,
        eventId: social.calendar_id,
        requestBody: { attendees: currentAttendees },
        sendUpdates: 'all',
      });
  }

  async leaveSailEvent(sail: Sail, profile: Profile) {
    if (!this.connected) {
      await this.connect();
    }

    if (!sail.calendar_id) {
      this.logger.log(`leaveSailEvent: no calendar event for sail ${sail.id}`);
      return Promise.resolve();
    }

    const existingEvent = await this.calendar
      .events
      .get({
        calendarId: CALENDAR_ID,
        eventId: sail.calendar_id,
      })
      .then(response => response.data);

    if (!existingEvent) {
      return Promise.resolve();
    }

    const currentAttendees = existingEvent.attendees || [];

    if (!currentAttendees.find(attendee => attendee.email === profile.email)) {
      return Promise.resolve();
    }

    const event = this.sailEvent(sail);

    return this.calendar
      .events
      .patch({
        calendarId: CALENDAR_ID,
        eventId: sail.calendar_id,
        requestBody: event,
        sendUpdates: 'all',
      });
  }

  async leaveSocialEvent(social: Social, profile: Profile) {
    if (!this.connected) {
      await this.connect();
    }

    if (!social.calendar_id) {
      this.logger.log(`leaveSailEvent: no calendar event for social ${social.id}`);
      return Promise.resolve();
    }

    const existingEvent = await this.calendar
      .events
      .get({
        calendarId: CALENDAR_ID,
        eventId: social.calendar_id,
      })
      .then(response => response.data);

    const currentAttendees = existingEvent.attendees || [];

    const newAttendees = currentAttendees.filter(attendee => attendee.email !== profile.email);

    return this.calendar
      .events
      .patch({
        calendarId: CALENDAR_ID,
        eventId: social.calendar_id,
        requestBody: { attendees: newAttendees },
        sendUpdates: 'all',
      });
  }

  private sailEvent(sail: Sail, message?: string) {
    const attendees: calendar_v3.Schema$EventAttendee[] = sail
      .manifest
      .filter(sailor => sailor.profile)
      .map(sailor => ({
        displayName: sailor.person_name,
        email: sailor.profile?.email,
        resource: false,
      }));

    if (sail.boat?.calendar_resource_id) {
      attendees.push({
        displayName: sail.boat?.name,
        email: sail.boat?.calendar_resource_id,
        resource: true,
      });
    }

    const skipperNames = sail.manifest.filter(sailor => sailor.sailor_role === SailorRole.Skipper).map(sailor => sailor.person_name);
    const crewNames = sail.manifest.filter(sailor => sailor.sailor_role === SailorRole.Crew).map(sailor => sailor.person_name);
    const sailorNames = sail
      .manifest
      .filter(sailor => ![
        SailorRole.Skipper,
        SailorRole.Crew,
        SailorRole.Guest,
      ].includes(sailor.sailor_role))
      .map(sailor => sailor.person_name);
    const guestNames = sail
      .manifest
      .filter(sailor => SailorRole.Guest === sailor.sailor_role)
      .map(sailor => `${sailor.person_name} (guest of ${sailor.guest_of.name})`);

    const event: calendar_v3.Schema$Event = {
      summary: `COMPANY_NAME_SHORT_HEADER: Sail #${sail.entity_number}: ${sail.name}`,
      description: `
        <!DOCTYPE html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
          <body>
            <h2>You are scheduled on a sail #${sail.entity_number}.</h2>
            <p><label>Message from organizer: </label></p>
            <pre>${message || 'Enjoy your sail.'}</pre>
            <h2>Sail details</h2>
            <div><label>Name: </label>${sail.name}</div>
            <div><label>Description: </label>${sail.description || 'n/a'}</div>
            <div><label>Start: </label>${toLocalDate(sail.start_at)}</div>
            <div><label>End: </label>${toLocalDate(sail.end_at)}</div>
            <div><label>Boat: ${sail.boat?.name || 'n/a'} </label></div>
            <div><label>Skipper: </label>${skipperNames.join(', ') || 'None'}</div>
            <div><label>Crew: </label>${crewNames.join(', ') || 'None'}</div>
            <p><label>Sailors: </label> ${sailorNames.join(', ') || 'None'}</p>
            <p><label>Guests: </label> ${guestNames.join(', ') || 'None'}</p>
            <div><a href="${DOMAIN}/sails/view/${sail.id}">View sail</a></div>
            <br/>
            <p>To cancel your reservation for this sail, you must go to the
            <a href="${DOMAIN}/sails/view/${sail.id}">sail page</a> and click the 'Leave' button
            at least 24 hours before the start of the sail.</p>
            <p>Cancelling/declining this calendar event will not remove you from the sail.</p>
            <p>If your guest cannot make the sail, then you must contact the skipper or the sail coordinator
            and ask them to remove the guest from the sail.</p>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
      start: { 'dateTime': sail.start_at.toISOString() },
      end: { 'dateTime': sail.end_at.toISOString() },
      attendees: attendees,
      guestsCanSeeOtherGuests: false,
      reminders: { 'useDefault': true },
    };

    this.logger.log(`sail event ${JSON.stringify(event, null, 2)}`);
    return event;
  }

  private socialEvent(social: Social, message: string) {
    let attendees: calendar_v3.Schema$EventAttendee[] = social.manifest
      .map(attendant => ({
        displayName: attendant.person_name,
        email: attendant.profile?.email,
        resource: false,
      }));

    attendees = attendees.filter(attendee => !!attendee.email);

    const attendantNames = social.manifest.map(sailor => sailor.person_name);

    const event: calendar_v3.Schema$Event = {
      summary: `COMPANY_NAME_SHORT_HEADER: Social #${social.entity_number}: ${social.name}`,
      description: `
        <!DOCTYPE html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
          <body>
            <h2>You are attending social #${social.entity_number}.</h2>
            <p><label>Message from organizer: </label></p>
            <pre>${message || 'Enjoy your social.'}</pre>
            <h2>Social details</h2>
            <div><label>Name: </label>${social.name}</div>
            <div><label>Description: </label>${social.description || 'n/a'}</div>
            <div><label>Start: </label>${toLocalDate(social.start_at)}</div>
            <div><label>End: </label>${toLocalDate(social.end_at)}</div>
            <div><label>Max capacity: </label>${(social.max_attendants == -1 ? 'unlimited' : social.max_attendants)}</div>
            <div><label>Address: ${social.address || 'n/a'} </label></div>
            <p><label>Attendants: </label> ${attendantNames.join(', ') || '-'}</p>
            <div><a href="${DOMAIN}/socials/view/${social.id}">View social</a></div>
            <br/>
            <p>To cancel your reservation for this soicial event, you must go to the
            <a href="${DOMAIN}/socials/view/${social.id}">social page</a> and click the 'Leave' button.</p>
            <p>Cancelling/declining this calendar event will not remove you from the social event.</p>
          </body>
        </html>
      `.trim().replace(/\n/g, ''),
      start: { 'dateTime': social.start_at.toISOString() },
      end: { 'dateTime': social.end_at.toISOString() },
      attendees: attendees,
      reminders: { 'useDefault': true },
      guestsCanSeeOtherGuests: false,
    };

    return event;
  }
}
