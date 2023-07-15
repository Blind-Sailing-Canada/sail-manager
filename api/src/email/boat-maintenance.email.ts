import {
  Injectable, Scope
} from '@nestjs/common';
import { DOMAIN } from '../auth/constants';
import { BoatMaintenance } from '../types/boat-maintenance/boat-maintenance';
import { Comment } from '../types/comment/comment';
import { EmailInfo } from '../types/email/email-info';
import { Media } from '../types/media/media';
import { MediaType } from '../types/media/media-type';
import { toLocalDate } from '../utils/date.util';

@Injectable({ scope: Scope.DEFAULT })
export class BoatMaintenanceEmail {

  outstandingMaintenanceRequestEmail(requests: BoatMaintenance[]): EmailInfo {
    const emailInfo: EmailInfo = {
      subject: `[COMPANY_NAME_SHORT_HEADER] Outstanding boat maintenance requests as of ${toLocalDate(new Date())}`,
      content: `
        <html>
          <body>
            <h2>There are ${requests.length} maintenance request are older than 2 months.</h2>
            <table>
              <caption>Maintenance Requests</caption>
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Boat</th>
                  <th>Submitted on</th>
                  <th>Days open</th>
                </tr>
              </thead>
              <tbody>
                ${this.maintenanceTableRows(requests)}
              </tbody>
            </table>
          </body>
        </html>
      `.trim(),
    };

    return emailInfo;
  }

  newMaintenanceRequestEmail(report: BoatMaintenance): EmailInfo {
    const emailInfo: EmailInfo = {
      subject: '[COMPANY_NAME_SHORT_HEADER] New boat maintenance request',
      content: `
        <html>
          <body>
            <h2>A new maintenance request was submitted</h2>
            <div>
              <label>Boat: </label> <span>${report.boat.name}</span>
            </div>
            <div>
              <label>Requested by: </label> <span>${report.requested_by.name}</span>
            </div>
            <div>
              <label>Requested on: </label> <span>${toLocalDate(report.created_at)}</span>
            </div>
            <div>
              <label>Request details: </label>
              <pre>${report.request_details}</pre>
            </div>
            <br/>
            <div>${this.picturesHTML(report.pictures)}</div>
            <br/>
            <br/>
            <a href="${DOMAIN}/maintenance/view/${report.id}">View request</a>
          </body>
        </html>
      `.trim(),
    };

    return emailInfo;
  }

  updatedMaintenanceRequestEmail(report: BoatMaintenance): EmailInfo{
    const emailInfo: EmailInfo = {
      subject: '[COMPANY_NAME_SHORT_HEADER] Boat maintenance request update',
      content: `
        <html>
          <body>
            <h2>Maintenance request was updated</h2>
            <div>
              <label>Boat: </label> <span>${report.boat.name}</span>
            </div>
            <div>
              <label>Requested by: </label> <span>${report.requested_by.name}</span>
            </div>
            <div>
              <label>Requested on: </label> <span>${toLocalDate(report.created_at)}</span>
            </div>
            <div>
              <label>Request details: </label>
              <pre>${report.request_details}</pre>
            </div>
            <br/>
            <div>${this.picturesHTML(report.pictures)}</div>
            <br/>
            <br/>
            <a href="${DOMAIN}/maintenance/view/${report.id}">View request</a>
          </body>
        </html>
      `,
    };

    return emailInfo;
  }

  newMaintenanceRequestCommentEmail(report: BoatMaintenance, comment: Comment): EmailInfo {
    if (!report || !comment?.author) {
      return;
    }

    const sendTo: Set<string> = new Set<string>();

    sendTo.add(report.requested_by.email);

    report
      .comments
      ?.filter(existingComment => existingComment.id !== comment.id)
      .filter(existingComment => existingComment.author)
      .forEach(existingComment => sendTo.add(existingComment.author.email));

    const emailInfo: EmailInfo = {
      subject: '[COMPANY_NAME_SHORT_HEADER] New comment on maintenance request',
      bcc: Array.from(sendTo),
      content: `
        <html>
          <body>
            <h2>New comment</h2>
            <div>
              <pre>${comment.comment}</pre>
            </div>
            <div>
              <label>Author: </label> <span>${comment.author.name}</span>
            </div>
            <div>
              <label>Posted on: </label> <span>${toLocalDate(comment.created_at)}</span>
            </div>
            <br/>
            <div>
              <label>Boat: </label> <span>${report.boat.name}</span>
            </div>
            <div>
              <label>Requested by: </label> <span>${report.requested_by.name}</span>
            </div>
            <div>
              <label>Requested on: </label> <span>${toLocalDate(report.created_at)}</span>
            </div>
            <br/>
            <br/>
            <a href="${DOMAIN}/maintenance/view/${report.id}">View request</a>
          </body>
        </html>
      `.trim(),
    };

    return emailInfo;
  }

  private picturesHTML(pictures: Media[]): string {
    return pictures
      .filter(picture => picture.media_type === MediaType.Picture)
      .map(picture => `<img width="150px" height="200px" src="${DOMAIN}/${picture.url}" alt="${picture.title??''}">`)
      .join('');
  }

  private maintenanceTableRows(reports: BoatMaintenance[]): string {
    return reports
      .map((report) => {
        return `
          <tr>
            <td>${report.request_details}</td>
            <td>${report.boat?.name}</td>
            <td>${toLocalDate(report.created_at)}</td>
            <td>${this.numberOfDaysSince(report.created_at)}</td>
            <td><a href="${DOMAIN}/maintenance/view/${report.id}">View request</a></td>
          </tr>
        `;
      })
      .join(' ');
  }

  private numberOfDaysSince(date: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const now = new Date();

    return Math.round(Math.abs((date.getTime() - now.getTime()) / oneDay));
  }

}
