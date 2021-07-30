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
import { SailorRole } from '../../../../../../api/src/types/sail-manifest/sailor-role';
import {
  arrivalSailChecklistRoute,
  departureSailChecklistRoute,
  editSailChecklistRoute,
  viewSailPeopleManifestRoute,
} from '../../../routes/routes';
import { SailChecklistBasePageComponent } from '../sail-checklist-base-page/sail-checklist-base-page';

@Component({
  selector: 'app-sail-checklist-view-page',
  templateUrl: './sail-checklist-view-page.component.html',
  styleUrls: ['./sail-checklist-view-page.component.css']
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
  public get editSailchecklistRouteLink(): string {
    return editSailChecklistRoute(this.sail_id);
  }

  public get departureSailchecklistRouteLink(): string {
    return departureSailChecklistRoute(this.sail_id);
  }

  public get arrivalSailchecklistRouteLink(): string {
    return arrivalSailChecklistRoute(this.sail_id);
  }

  public gotToPeopleManifestRouteLink(): void {
    this.goTo([viewSailPeopleManifestRoute(this.sail_id)]);
  }

  public get shouldAllowEdit(): boolean {
    const user = this.user.profile;

    return this
      .sail
      .manifest
      .filter(sailor => sailor.profile_id === user.id)
      .some(sailor => [SailorRole.Crew, SailorRole.Skipper].includes(sailor.sailor_role));
  }
}
