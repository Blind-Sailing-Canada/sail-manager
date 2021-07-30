import {
  Injectable, Scope
} from '@nestjs/common';
import { DOMAIN } from '../auth/constants';
import { BoatMaintenance } from '../types/boat-maintenance/boat-maintenance';
import { Comment } from '../types/comment/comment';
import { EmailInfo } from '../types/email/email-info';
import { Media } from '../types/media/media';
import { toLocalDate } from '../utils/date.util';

@Injectable({ scope: Scope.DEFAULT })
export class BoatMaintenanceEmail {

  newMaintenanceRequestEmail(report: BoatMaintenance): EmailInfo {
    const emailInfo: EmailInfo = {
      subject: 'New boat maintenance request',
      content: `
        <html>
          <body>
            <h2>A new maintenace request was submitted</h2>
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
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }

  updatedMaintenanceRequestEmail(report: BoatMaintenance): EmailInfo{
    const emailInfo: EmailInfo = {
      subject: 'Boat maintenance request update',
      content: `
        <html>
          <body>
            <h2>Maintenace request was updated</h2>
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
    const sendTo: Set<string> = new Set<string>();

    sendTo.add(report.requested_by.email);

    report
      .comments
      .filter(existingComment => existingComment.id !== comment.id)
      .forEach(existingComment => sendTo.add(existingComment.author.email));

    const emailInfo: EmailInfo = {
      subject: 'New comment on maintenance request',
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
      `.trim().replace(/\n/g, ''),
    };

    return emailInfo;
  }

  private picturesHTML(pictures: Media[]): string {
    return pictures.map(picture => `<img width="150px" height="200px" src="${DOMAIN}/${picture.url}" alt="${picture.title}">`).join('');
  }

}
