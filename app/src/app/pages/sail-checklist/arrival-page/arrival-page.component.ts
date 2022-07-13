import {
  Component,
  Inject,
} from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { SailChecklistType } from '../../../../../../api/src/types/sail-checklist/sail-checklist-type';
import { createMaintenanceRoute } from '../../../routes/routes';
import { SailChecklistBasePageComponent } from '../sail-checklist-base-page/sail-checklist-base-page';

@Component({
  selector: 'app-arrival-page',
  templateUrl: './arrival-page.component.html',
  styleUrls: ['./arrival-page.component.scss']
})
export class ArrivalPageComponent extends SailChecklistBasePageComponent {

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(UntypedFormBuilder) fb: UntypedFormBuilder,
  ) {
    super(store, route, router, fb, null);
    this.checklist_type = SailChecklistType.After;

    if (fb) {
      this.buildForm();
    }
  }

  public goToMaintenanceRequest(): void {
    this.goTo(
      [createMaintenanceRoute],
      {
        queryParams: { boat_id: this.sail.boat.id },
      }
    );
  }

}
