import { Component } from '@angular/core';
import { updateInstructions } from '../../../store/actions/instructions.actions';
import { BoatInstructionsBasePageComponent } from '../boat-instructions-base-page/boat-instructions-base-page.component';

@Component({
  selector: 'app-boat-instructions-view-page',
  templateUrl: './boat-instructions-view-page.component.html',
  styleUrls: ['./boat-instructions-view-page.component.css']
})
export class BoatInstructionsViewPageComponent extends BoatInstructionsBasePageComponent {

  public  rearrange: boolean;

  private arrivalChanged: boolean;
  private departureChanged: boolean;

  public toggleRearrange(): void {
    this.rearrange = !this.rearrange;
  }

  public departureReordered(): void {
    this.departureChanged = true;
  }

  public arrivalReordered(): void {
    this.arrivalChanged = true;
  }

  public save(): void {
    if (this.departureChanged) {
      this.dispatchAction(
        updateInstructions({ id: this.departure.id, instructions: { instructions: this.departure.instructions }, notify: true }),
      );
    }

    if (this.arrivalChanged) {
      this.dispatchAction(
        updateInstructions({ id: this.arrival.id, instructions: { instructions: this.arrival.instructions }, notify: true }),
      );
    }

    this.departureChanged = false;
    this.arrivalChanged = false;
    this.toggleRearrange();
  }
}
