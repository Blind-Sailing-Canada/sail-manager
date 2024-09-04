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
import { EntityType } from '../../../models/entity-type';
import {
  editBoatChecklistRoute,
  editBoatRoute,
  listDocumentsRoute,
  maintenanceRoute,
  sailChecklistsRoute,
  viewBoatInstructionsRoute,
} from '../../../routes/routes';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { deleteBoat } from '../../../store/actions/boat.actions';
import { ConfirmDialogData } from '../../../models/confirm-dialog-data';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-boat-view-page',
  templateUrl: './boat-view-page.component.html',
  styleUrls: ['./boat-view-page.component.scss']
})
export class BoatViewPageComponent extends BasePageComponent implements OnInit {

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
  ) {
    super(store, route, router, dialog);
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
        queryParams: { boat_id: this.boat_id, boatName: this.boat?.name },
      }
    );
  }

  public goToBoatDocuments(): void {
    this.goTo(
      [listDocumentsRoute()],
      {
        queryParams: { entity_type: EntityType.Boat, entity_id: this.boat_id },
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
    return !!this.user.access[UserAccessFields.EditBoat];
  }

  public editBoat(boat_id: string): string {
    return editBoatRoute(boat_id);
  }

  private deleteBoat(): void {
    this.dispatchAction(deleteBoat({ boat_id: this.boat_id }));
  }

  public editBoatChecklist(boat_id: string): string {
    return editBoatChecklistRoute(boat_id);
  }

  public goToBoatMaintenance(): void {
    this.goTo(
      [maintenanceRoute],
      { queryParams: { boat_id: this.boat_id } },
    );
  }

  openConfirmBoatDeletionDialog(): void {
    const dialogData: ConfirmDialogData = {
      title: `Are you sure you want to delete ${this.boat?.name}?`,
      message: 'This cannot be undone.'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirmed') {
        this.deleteBoat();
      }
    });
  }
}
