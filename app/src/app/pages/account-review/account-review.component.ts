import {
  Component,
  Inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ProfileStatus } from '../../../../../api/src/types/profile/profile-status';

import { BasePageComponent } from '../base-page/base-page.component';

@Component({
  selector: 'app-account-review',
  templateUrl: './account-review.component.html',
  styleUrls: ['./account-review.component.scss']
})
export class AccountReviewComponent extends BasePageComponent {

  public ProfileStatus = ProfileStatus;

  constructor(
    @Inject(Store) store: Store<any>,
  ) {
    super(store);
  }

}
