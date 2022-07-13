import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Profile } from '../../../../../api/src/types/profile/profile';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnChanges {

  @Input() profile: Profile;
  @Input() actions: any;
  @Output() actionsClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() viewClinic: EventEmitter<string> = new EventEmitter<string>();

  public roles: string;

  ngOnChanges(): void {
    this.roles = this.profile.roles.join(', ');
  }

  public actionClicked(event): void {
    this.actionsClicked.emit(event);
  }

  public triggerClick(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.click();
    }
  }

  public goToAchievement(clinic_id: string): void {
    this.viewClinic.emit(clinic_id);
  }

}
