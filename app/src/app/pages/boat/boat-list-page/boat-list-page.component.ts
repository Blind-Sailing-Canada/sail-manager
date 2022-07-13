import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Boat } from '../../../../../../api/src/types/boat/boat';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';
import {
  createBoatRoute,
  maintenanceRoute,
  viewBoatRoute,
} from '../../../routes/routes';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-boat-list-page',
  templateUrl: './boat-list-page.component.html',
  styleUrls: ['./boat-list-page.component.scss']
})
export class BoatListPageComponent extends BasePageComponent implements OnInit {

  public CREATE_BOAT_ROUTE = createBoatRoute.toString();
  public MAINTENANCE_ROUTE = maintenanceRoute.toString();

  constructor(
    @Inject(Router) router: Router,
    @Inject(Store) store: Store<any>,
  ) {
    super(store, undefined, router);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);

    this.refreshBoats(false);
  }

  public refreshBoats(notify?: boolean): void {
    this.fetchBoats(notify);
  }

  public get boatsArray(): Boat[] {
    return Object
      .keys(this.boats || {})
      .map(id => this.boats[id]);
  }

  public clickedBoat(boat: Boat): void {
    this.goTo([viewBoatRoute(boat.id)]);
  }

  public get shouldEnableNewButton(): boolean {
    return !!this.user.access[UserAccessFields.CreateBoat];
  }

}
