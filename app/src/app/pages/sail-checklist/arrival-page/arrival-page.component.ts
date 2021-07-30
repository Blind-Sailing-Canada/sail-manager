import {
  Component,
  Inject,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { createMaintenanceRoute } from '../../../routes/routes';
import { SailChecklistBasePageComponent } from '../sail-checklist-base-page/sail-checklist-base-page';

@Component({
  selector: 'app-arrival-page',
  templateUrl: './arrival-page.component.html',
  styleUrls: ['./arrival-page.component.css']
})
export class ArrivalPageComponent extends SailChecklistBasePageComponent {

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) fb: FormBuilder,
  ) {
    super(store, route, router, fb, null);
    this.checklist_type = 'after';
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
