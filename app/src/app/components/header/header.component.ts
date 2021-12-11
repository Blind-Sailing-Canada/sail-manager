import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Profile } from '../../../../../api/src/types/profile/profile';
import {
  helpRoute,
  profileSettingsRoute,
  viewProfileRoute,
} from '../../routes/routes';
import { FirebaseService } from '../../services/firebase.service';
import {
  WINDOW_WIDTH,
  WindowService,
} from '../../services/window.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnChanges {

  @Input() userProfile: Profile;
  @Output() logoutListener: EventEmitter<void> = new EventEmitter<void>();

  public WindowWidth = WINDOW_WIDTH;
  public viewHelpLink: string;
  public viewProfileLink: string;
  public viewProfileSettingsLink: string;

  constructor(
    @Inject(WindowService) public windowServer: WindowService,
    @Inject(FirebaseService) private firebaseService: FirebaseService,
  ) { }

  ngOnChanges(): void {
    this.viewProfileLink = viewProfileRoute(this.userProfile?.id);
    this.viewHelpLink = helpRoute.toString();
    this.viewProfileSettingsLink = profileSettingsRoute.toString();
  }

  public logout(): void {
    this.logoutListener.emit();
    this.firebaseService.logout();
  }
}
