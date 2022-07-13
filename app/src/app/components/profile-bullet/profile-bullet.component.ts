import {
  Component,
  Input,
} from '@angular/core';
import { Profile } from '../../../../../api/src/types/profile/profile';

@Component({
  selector: 'app-profile-bullet',
  templateUrl: './profile-bullet.component.html',
  styleUrls: ['./profile-bullet.component.scss']
})
export class ProfileBulletComponent {

  @Input() profile: Profile;

}
