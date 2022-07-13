import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { _USER_RUNTIME_CHECKS } from '@ngrx/store/src/tokens';
import { SailChecklistType } from '../../../../../../api/src/types/sail-checklist/sail-checklist-type';
import { SailorRole } from '../../../../../../api/src/types/sail-manifest/sailor-role';
import {
  arrivalSailChecklistRoute,
  departureSailChecklistRoute,
  editSailChecklistRoute,
} from '../../../routes/routes';
import { SailChecklistBasePageComponent } from '../sail-checklist-base-page/sail-checklist-base-page';

@Component({
  selector: 'app-sail-checklist-view-page',
  templateUrl: './sail-checklist-view-page.component.html',
  styleUrls: ['./sail-checklist-view-page.component.scss']
})
export class SailChecklistViewPageComponent extends SailChecklistBasePageComponent implements OnInit {

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
  ) {
    super(store, route, router, undefined, dialog);
  }
  public get editSailChecklistRouteLink(): string {
    return editSailChecklistRoute(this.sail_id);
  }

  public get departureSailChecklistRouteLink(): string {
    return departureSailChecklistRoute(this.sail_id);
  }

  public get arrivalSailChecklistRouteLink(): string {
    return arrivalSailChecklistRoute(this.sail_id);
  }

  public get shouldAllowEdit(): boolean {
    const user = this.user.profile;

    return this
      .sail
      .manifest
      .filter(sailor => sailor.profile_id === user.id)
      .some(sailor => [SailorRole.Crew, SailorRole.Skipper].includes(sailor.sailor_role));
  }

  public get beforeChecklist() {
    return this.sail?.checklists?.find(checklist => checklist.checklist_type === SailChecklistType.Before);
  }

  public get afterChecklist() {
    return this.sail?.checklists?.find(checklist => checklist.checklist_type === SailChecklistType.After);
  }
}
