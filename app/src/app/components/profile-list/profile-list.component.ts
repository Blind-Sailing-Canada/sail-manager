import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Profile } from '../../../../../api/src/types/profile/profile';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss']
})
export class ProfileListComponent {

  @Input() public profiles: Profile[];
  @Input() public title: string;
  @Input() public emptyMessage = 'There are no profiles.';
  @Output() public refreshAction: EventEmitter<void> = new EventEmitter<void>();
  @Output() public profileClick: EventEmitter<Profile> = new EventEmitter<Profile>();

  public captionActions = [
    {
      name: 'refresh',
      icon: 'refresh',
      tooltip: 'refresh',
    },
  ];

  public refresh() {
    this.refreshAction.emit();
  }

  public clickProfile(profile: Profile): void {
    this.profileClick.emit(profile);
  }

}
