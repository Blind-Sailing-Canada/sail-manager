import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { BoatInstructions } from '../../../../../../api/src/types/boat-instructions/boat-instructions';
import {
  deleteFile,
  uploadDepartureInstructionsPicture,
} from '../../../store/actions/cdn.actions';
import { updateBoatInstructions } from '../../../store/actions/instructions.actions';
import { STORE_SLICES } from '../../../store/store';
import { BoatInstructionsBasePageComponent } from '../boat-instructions-base-page/boat-instructions-base-page.component';

@Component({
  selector: 'app-boat-instructions-edit-page',
  templateUrl: './boat-instructions-edit-page.component.html',
  styleUrls: ['./boat-instructions-edit-page.component.css']
})
export class BoatInstructionsEditPageComponent extends BoatInstructionsBasePageComponent implements OnInit {

  public departureInstructionsForm: FormGroup;
  public arrivalInstructionsForm: FormGroup;
  public savingForm = false;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder,
  ) {
    super(store, route, router);
    this.buildForm();
  }

  ngOnInit() {
    super.ngOnInit();

    if (!this.user) {
      return;
    }

    this.subscribeToStoreSliceWithUser(STORE_SLICES.CDN);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS, () => {
      if (this.departure) {
        this.updateForm(this.departure, undefined);
        this.savingForm = false;
      }

      if (this.arrival) {
        this.updateForm(undefined, this.arrival);
        this.savingForm = false;
      }
    });
  }

  public get title(): string {
    return `Edit Boat Instructions Form for ${this.boat?.name}`;
  }

  public addDepartureInstruction(): void {
    const newInstruction = this.createNewInstruction();
    (this.departureInstructionsForm.controls.instructions as FormArray).push(newInstruction);
    this.departureInstructionsForm.markAsDirty();
    this.departureInstructionsForm.updateValueAndValidity();
  }

  public removeDepartureInstruction(index: number): void {
    (this.departureInstructionsForm.controls.instructions as FormArray).removeAt(index);
    this.departureInstructionsForm.markAsDirty();
    this.departureInstructionsForm.updateValueAndValidity();
  }

  public removeArrivalInstruction(index: number): void {
    (this.arrivalInstructionsForm.controls.instructions as FormArray).removeAt(index);
    this.arrivalInstructionsForm.markAsDirty();
    this.arrivalInstructionsForm.updateValueAndValidity();
  }

  public addArrivalInstruction(): void {
    const newInstruction = this.createNewInstruction();
    (this.arrivalInstructionsForm.controls.instructions as FormArray).push(newInstruction);
    this.arrivalInstructionsForm.markAsDirty();
    this.arrivalInstructionsForm.updateValueAndValidity();
  }

  public get departureInstructionsControls(): AbstractControl[] {
    return (this.departureInstructionsForm.controls.instructions as FormArray).controls;
  }

  public get arrivalInstructionsControls(): AbstractControl[] {
    return (this.arrivalInstructionsForm.controls.instructions as FormArray).controls;
  }

  public deleteFile(filePath: string): void {
    this.dispatchAction(deleteFile({ filePath, notify: true }));
  }

  public uploadDepartureInstructionsPictureToCDN(file: File): void {
    this.dispatchAction(uploadDepartureInstructionsPicture({ file, boat_id: this.boat_id, notify: true }));
  }

  public uploadArrivalInstructionsPictureToCDN(file: File): void {
    this.dispatchAction(uploadDepartureInstructionsPicture({ file, boat_id: this.boat_id, notify: true }));
  }

  public get shouldEnableSaveButton(): boolean {
    const depInstructions = this.departureInstructionsForm.dirty
      && this.departureInstructionsForm.valid;

    const ariInstructions = this.arrivalInstructionsForm.dirty
      && this.arrivalInstructionsForm.valid;

    const should = (depInstructions || ariInstructions);
    return should;
  }

  public submitForm(): void {
    const instructions = {};

    if (this.departureInstructionsForm.dirty) {
      instructions[this.departure.id] = {
        instructions: this.departureInstructionsForm.controls.instructions.value,
      };
    }

    if (this.arrivalInstructionsForm.dirty) {
      instructions[this.arrival.id] = {
        instructions: this.arrivalInstructionsForm.controls.instructions.value,
      };
    }

    this.dispatchAction(updateBoatInstructions({ instructions, boat_id: this.boat_id, notify: true }));
  }

  private updateForm(departure: BoatInstructions, arrival: BoatInstructions): void {
    if (departure) {
      const departures = this.departureInstructionsForm.controls.instructions as FormArray;

      while (departures.length) {
        departures.removeAt(0);
      }

      const departureInstructions = (departure.instructions || []);

      departureInstructions
        .forEach((inst) => {
          const newPictures = this.fb.array((inst.media || []).map(pic => this.fb.group({
            description: pic.description,
            url: pic.url,
          })));

          const newForm = this.fb.group({
            description: this.fb.control(inst.description, Validators.required),
            title: this.fb.control(inst.title, Validators.required),
            media: newPictures,
          });

          newForm.setParent(departures);

          departures.push(newForm);
        });

      this.departureInstructionsForm.updateValueAndValidity();
      this.departureInstructionsForm.markAsUntouched();
      this.departureInstructionsForm.markAsPristine();
    }

    if (arrival) {
      const arrivals = this.arrivalInstructionsForm.controls.instructions as FormArray;

      while (arrivals.length) {
        arrivals.removeAt(0);
      }

      (arrival.instructions || []).forEach(inst => arrivals.push(this.fb.group({
        description: this.fb.control(inst.description, Validators.required),
        title: this.fb.control(inst.title, Validators.required),
        media: this.fb.array((inst.media || []).map(pic => this.fb.group({
          description: pic.description,
          url: pic.url,
        }))),

      })));

      this.arrivalInstructionsForm.updateValueAndValidity();
      this.arrivalInstructionsForm.markAsUntouched();
      this.arrivalInstructionsForm.markAsPristine();
    }
  }

  private buildForm(): void {
    this.departureInstructionsForm = this.fb.group({
      instructions: this.fb.array([]),
    });
    this.arrivalInstructionsForm = this.fb.group({
      instructions: this.fb.array([]),
    });
  }

  private createNewInstruction(): FormGroup {
    return this.fb.group({
      title: this.fb.control(undefined, Validators.required),
      description: this.fb.control(undefined, Validators.required),
      media: this.fb.array([]),
    });
  }
}
