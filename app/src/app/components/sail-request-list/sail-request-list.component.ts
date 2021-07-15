import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Profile } from '../../../../../api/src/types/profile/profile';
import { SailRequest } from '../../../../../api/src/types/sail-request/sail-request';
import { SailRequestStatus } from '../../../../../api/src/types/sail-request/sail-request-status';
import { UserAccessFields } from '../../../../../api/src/types/user-access/user-access-fields';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-sail-request-list',
  templateUrl: './sail-request-list.component.html',
  styleUrls: ['./sail-request-list.component.css']
})
export class SailRequestListComponent {

  @Input() expandedId: string = null;
  @Input() sailRequests: SailRequest[] = [];
  @Input() user: User;
  @Output() cancelSailRequest: EventEmitter<string> = new EventEmitter<string>();
  @Output() createSail: EventEmitter<string> = new EventEmitter<string>();
  @Output() editSailRequest: EventEmitter<string> = new EventEmitter<string>();
  @Output() joinSailRequest: EventEmitter<string> = new EventEmitter<string>();
  @Output() leaveSailRequest: EventEmitter<string> = new EventEmitter<string>();
  @Output() profileDialog: EventEmitter<Profile> = new EventEmitter<Profile>();
  @Output() setExpandedId: EventEmitter<string> = new EventEmitter<string>();
  @Output() viewSailRoute: EventEmitter<string> = new EventEmitter<string>();

  public showProfileDialog(profile: Profile): void {
    this.profileDialog.emit(profile);
  }

  public canCancelRequest(request: SailRequest): boolean {
    return request.status !== SailRequestStatus.Cancelled && this.canEditRequest(request);
  }

  public canCreateSail(request: SailRequest): boolean {
    return request.status === SailRequestStatus.New && this.user.access[UserAccessFields.CreateSail];
  }

  public canEditRequest(request: SailRequest): boolean {

    if (request.status === SailRequestStatus.Scheduled) {
      return false;
    }

    if (this.user.profile.id === request.requestedById) {
      return true;
    }

    return !!this.user.access[UserAccessFields.EditSailRequest];
  }

  public canJoinRequest(request: SailRequest): boolean {

    if (request.status !== SailRequestStatus.New) {
      return false;
    }

    if (request.interest.some(interest => interest.profileId === this.user.profile.id)) {
      return false;
    }

    return true;
  }

  public canLeaveRequest(request: SailRequest): boolean {
    if (request.status !== SailRequestStatus.New) {
      return false;
    }

    return request.interest.some(interest => interest.profileId === this.user.profile.id);
  }

}
