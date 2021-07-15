import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RequiredAction } from '../../../../../api/src/types/required-action/required-action';
import { RequiredActionType } from '../../../../../api/src/types/required-action/required-action-type';

@Component({
  selector: 'app-required-actions-list',
  templateUrl: './required-actions-list.component.html',
  styleUrls: ['./required-actions-list.component.css']
})
export class RequiredActionsListComponent {

  @Input() actions: RequiredAction[] = [];
  @Input() title = 'Required Actions:';
  @Output() actionClick: EventEmitter<RequiredAction> = new EventEmitter<RequiredAction>();

  public actionIcon(actionType: RequiredActionType): string {
    switch (actionType) {
      case RequiredActionType.ReviewNewUser:
        return 'person_add';
      case RequiredActionType.RateSail:
        return 'stars';
      case RequiredActionType.ConfirmSailAttendance:
        return 'thumbs_up_down';
      default:
        return 'notification_important';
    }
  }

  public clicked(action: RequiredAction): void {
    this.actionClick.emit(action);
  }

  public clickedViaKey(event, action: RequiredAction): void {
    if (event.key !== 'Enter') {
      return;
    }

    this.clicked(action);
  }
}
