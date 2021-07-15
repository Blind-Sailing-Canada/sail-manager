import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Profile } from '../../../../../api/src/types/profile/profile';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {

  @Input() profile: Profile;
  @Input() actions: any;
  @Output() actionsClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() viewClinic: EventEmitter<string> = new EventEmitter<string>();

  public actionClicked(event): void {
    this.actionsClicked.emit(event);
  }

  public get roles(): string {
    return this.profile.roles.join(', ');
  }

  public triggerClick(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.click();
    }
  }

  public goToAcheivement(clinicId: string): void {
    this.viewClinic.emit(clinicId);
  }

}
