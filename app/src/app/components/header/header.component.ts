import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { Profile } from '../../../../../api/src/types/profile/profile';
import {
  helpRoute,
  profileSettingsRoute,
  viewProfileRoute,
} from '../../routes/routes';
import {
  WINDOW_WIDTH,
  WindowService,
} from '../../services/window.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() userProfile: Profile;
  @Output() logoutListner: EventEmitter<void> = new EventEmitter<void>();
  public WindowWidth = WINDOW_WIDTH;

  constructor(
    @Inject(WindowService) public windowServer: WindowService,
  ) { }

  public logout(): void {
    this.logoutListner.emit();
  }

  public get viewProfileLink(): string {
    return viewProfileRoute(this.userProfile.id);
  }

  public get viewProfileSettingsLink(): string {
    return profileSettingsRoute.toString();
  }

  public get viewHelpLink(): string {
    return helpRoute.toString();
  }
}
