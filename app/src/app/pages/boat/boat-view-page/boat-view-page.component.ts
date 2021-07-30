import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Boat } from '../../../../../../api/src/types/boat/boat';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';
import {
  editBoatRoute,
  maintenanceRoute,
  sailChecklistsRoute,
  viewBoatInstructionsRoute,
} from '../../../routes/routes';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-boat-view-page',
  templateUrl: './boat-view-page.component.html',
  styleUrls: ['./boat-view-page.component.css']
})
export class BoatViewPageComponent extends BasePageComponent implements OnInit {

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);
  }

  public goToBoatInstructions(): void {
    this.goTo([viewBoatInstructionsRoute(this.boat_id)]);
  }

  public goToChecklists(): void {
    this.goTo(
      [sailChecklistsRoute],
      {
        queryParams: { boat_id: this.boat_id, boatName: this.boat.name },
      }
    );
  }

  public get boat_id(): string {
    return this.route.snapshot.params.id;
  }

  public get boat(): Boat {
    return this.getBoat(this.boat_id);
  }

  public get shouldShowEditBoat(): boolean {
    return !!this.user.access[UserAccessFields.EditSailRequest];
  }

  public editBoat(id): string {
    return editBoatRoute(id);
  }

  public goToBoatMaintenance(): void {
    this.goTo(
      [maintenanceRoute],
      { queryParams: { boat_id: this.boat_id } },
    );
  }
}
