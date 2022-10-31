import {
  gmail_v1, google
} from 'googleapis';
import {
  Injectable, Logger
} from '@nestjs/common';
import { EmailInfo } from '../types/email/email-info';
import * as Sentry from '@sentry/node';

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID_SAILS;

@Injectable()
export class GoogleEmailService {
  private gmail: gmail_v1.Gmail;
  private connected = false;
  private readonly logger = new Logger(GoogleEmailService.name);

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
          'https://mail.google.com/',
          'https://www.googleapis.com/auth/gmail.addons.current.action.compose',
          'https://www.googleapis.com/auth/gmail.compose',
          'https://www.googleapis.com/auth/gmail.modify',
          'https://www.googleapis.com/auth/gmail.send',
        ],
      }
    );

    await jwtClient
      .authorize()
      .catch(error => {
        this.logger.error('failed to authorize google gmail in connect()');
        this.logger.error(error);
        Sentry.captureException(error);
        throw error;
      });

    this.gmail = google.gmail({
      version: 'v1',
      auth: jwtClient,
    });

    this.connected = true;
  }

  async sendBccEmail(emailInfo: EmailInfo) {
    if (!emailInfo || !emailInfo.bcc || !emailInfo.bcc.length) {
      return Promise.resolve();
    }

    if (!this.connected) {
      await this.connect();
    }

    const utf8Subject = `=?utf-8?B?${Buffer.from(emailInfo.subject).toString('base64')}?=`;
    const messageParts = [
      `Bcc: ${emailInfo.bcc.join(', ')}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      emailInfo.content,
    ];
    const message = messageParts.join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return this.gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage },
    });
  }

  async sendToEmail(emailInfo: EmailInfo) {
    if (!emailInfo) {
      return Promise.resolve();
    }

    if (!this.connected) {
      await this.connect();
    }

    const utf8Subject = `=?utf-8?B?${Buffer.from(emailInfo.subject).toString('base64')}?=`;
    const messageParts = [
      `To: ${emailInfo.to.join(', ')}`,
      `Bcc: ${emailInfo.bcc.join(', ')}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      emailInfo.content,
    ];
    const message = messageParts.join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    return this.gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: encodedMessage },
    });
  }
}
