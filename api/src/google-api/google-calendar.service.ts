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
        console.error(error);
        Sentry.captureException(error);
        throw error;
      });

    this.calendar = google.calendar({
      version: 'v3',
      auth: jwtClient,
    });

    this.connected = true;

  }

  async createSailEvent(sail: Sail, message: string) {
    if (!this.connected) {
      await this.connect();
    }

    const event = this.sailEvent(sail, message);

    if (!event.attendees?.length) {
      this.logger.log(`no sailors for sail ${sail.id}`);
      return Promise.resolve();
    }

    const createdEvent = await this.calendar
      .events
      .insert({
        calendarId: CALENDAR_ID,
        requestBody: event,
        sendNotifications: true,
      })
      .then(response => response.data);

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

    const currentAttendees = existingEvent.attendees;

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
        eventId: sail.calendar_id,
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

    const currentAttendees = existingEvent.attendees;

    const newAttendees = currentAttendees.filter(attendee => attendee.email !== profile.email);

    return this.calendar
      .events
      .patch({
        calendarId: CALENDAR_ID,
        eventId: sail.calendar_id,
        requestBody: { attendees: newAttendees },
        sendUpdates: 'all',
      });
  }

  private sailEvent(sail: Sail, message: string) {
    const attendees = sail.manifest.map(sailor => ({
      displayName: sailor.person_name,
      email: sailor.profile?.email,
      resource: false,
    }));

    if (sail.boat.calendar_resource_id) {
      attendees.push({
        resource: true,
        displayName: sail.boat.name,
        email: sail.boat.calendar_resource_id,
      });
    }

    const skipperName = sail.manifest.find(sailor => sailor.sailor_role === SailorRole.Skipper)?.person_name || 'n/a';
    const crewNames = sail.manifest.filter(sailor => sailor.sailor_role === SailorRole.Crew).map(sailor => sailor.person_name);
    const sailorNames = sail.manifest.filter(sailor => sailor.sailor_role === SailorRole.Sailor).map(sailor => sailor.person_name);

    const event = {
      'summary': `COMPANY_NAME_SHORT_HEADER: Sail #${sail.entity_number}: ${sail.name}`,
      'description': `
        <!DOCTYPE html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
          <body>
            <h2>You are scheduled on a sail #8.</h2>
            <p><label>Message from organizer: </label></p>
            <pre>${message || 'Enjoy your sail.'}</pre>
            <h2>Sail details</h2>
            <div><label>Name: </label>${sail.name}</div>
            <div><label>Description: </label>${sail.description || 'n/a'}</div>
            <div><label>Start: </label>${toLocalDate(sail.start_at)}</div>
            <div><label>End: </label>${toLocalDate(sail.end_at)}</div>
            <div><label>Boat: ${sail.boat.name} </label></div>
            <div><label>Skipper: </label>${skipperName}</div>
            <div><label>Crew: </label>${crewNames.join(', ') || '-'}</div>
            <p><label>Sailors: </label> ${sailorNames.join(', ') || '-'}</p>
            <div><a href="${DOMAIN}/sails/view/${sail.id}">View sail</a></div>
          </body>
        </html>
      `.trim().replace(/\n/g,''),
      'start': { 'dateTime': sail.start_at.toISOString() },
      'end': { 'dateTime':sail.end_at.toISOString() },
      'attendees': attendees,
      'reminders': { 'useDefault': true },
    };

    return event;
  }
}
