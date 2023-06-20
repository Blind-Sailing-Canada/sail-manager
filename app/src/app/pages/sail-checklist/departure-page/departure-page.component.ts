import {
  Component,
  Inject,
} from '@angular/core';
import {
  UntypedFormBuilder,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { SailChecklistType } from '../../../../../../api/src/types/sail-checklist/sail-checklist-type';
import { SailStatus } from '../../../../../../api/src/types/sail/sail-status';
import {
  maintenanceRoute,
  sailChecklistsRoute,
} from '../../../routes/routes';
import { SailChecklistBasePageComponent } from '../sail-checklist-base-page/sail-checklist-base-page';

@Component({
  selector: 'app-departure-page',
  templateUrl: './departure-page.component.html',
  styleUrls: ['./departure-page.component.scss']
})
export class DeparturePageComponent extends SailChecklistBasePageComponent {

  public showNewGuestForm = false;
  public SailStatus = SailStatus;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(UntypedFormBuilder) fb: UntypedFormBuilder,
    @Inject(MatDialog) dialog: MatDialog,
  ) {
    super(store, route, router, fb, dialog);
    this.checklist_type = SailChecklistType.Before;

    if (fb) {
      this.buildForm();
    }
  }

  public goToMaintenance(): void {
    this.goTo(
      [maintenanceRoute],
      {
        queryParams: { boat_id: this.sail.boat.id },
      }
    );
  }

  public goToPreviousChecklists(): void {
    this.goTo(
      [sailChecklistsRoute],
      {
        queryParams: {
          boat_id: this.sail.boat.id,
          boatName: this.sail.boat.name,
          excludeSailId: this.sail_id
        },
      }
    );
  }

}
