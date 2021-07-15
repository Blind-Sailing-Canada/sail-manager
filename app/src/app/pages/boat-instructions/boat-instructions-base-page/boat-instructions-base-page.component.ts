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
import { BoatInstruction } from '../../../../../../api/src/types/boat-instructions/boat-instruction';
import { BoatInstructionType } from '../../../../../../api/src/types/boat-instructions/boat-instruction-type';
import { BoatInstructions } from '../../../../../../api/src/types/boat-instructions/boat-instructions';
import { Boat } from '../../../../../../api/src/types/boat/boat';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';
import { editBoatInstructionsRoute } from '../../../routes/routes';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-boat-instructions-base-page',
  template: ''
})
export class BoatInstructionsBasePageComponent extends BasePageComponent implements OnInit {

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);

  }

  public get boat(): Boat {
    return this.getBoat(this.boatId);
  }

  public get boatId(): string {
    return this.route.snapshot.params.id;
  }

  public get title(): string {
    return `Boat Instructions for ${this.boat?.name}`;
  }

  public get departure(): BoatInstructions {
    return this.boat?.instructions.find(instruction => instruction.instructionType === BoatInstructionType.Departure);
  }

  public get arrival(): BoatInstructions {
    return this.boat?.instructions.find(instruction => instruction.instructionType === BoatInstructionType.Arrival);
  }

  public get departureInstructions(): BoatInstruction[] {
    return this.boat?.instructions.find(instruction => instruction.instructionType === BoatInstructionType.Departure)?.instructions || [];
  }

  public get arrivalInstructions(): BoatInstruction[] {
    return this.boat?.instructions.find(instruction => instruction.instructionType === BoatInstructionType.Arrival)?.instructions || [];
  }

  public goToBoatInstructions(): void {
    this.goTo([editBoatInstructionsRoute(this.boatId)]);
  }

  public get shouldEnableEditButton(): boolean {
    return !!this.user.access[UserAccessFields.EditBoat];
  }

}
