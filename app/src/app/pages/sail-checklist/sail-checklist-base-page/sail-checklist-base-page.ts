import {
  Component,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { BoatInstruction } from '../../../../../../api/src/types/boat-instructions/boat-instruction';
import { BoatInstructionType } from '../../../../../../api/src/types/boat-instructions/boat-instruction-type';
import { BilgeState } from '../../../../../../api/src/types/sail-checklist/bilge-state';
import { FireExtinguisherState } from '../../../../../../api/src/types/sail-checklist/fire-exstinguisher-state';
import { FlaresState } from '../../../../../../api/src/types/sail-checklist/flare-state';
import { FuelState } from '../../../../../../api/src/types/sail-checklist/fuel-state';
import { SailChecklistType } from '../../../../../../api/src/types/sail-checklist/sail-checklist-type';
import { Sail } from '../../../../../../api/src/types/sail/sail';
import { updateSailChecklists } from '../../../store/actions/sail-checklist.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  template: ''
})
export class SailChecklistBasePageComponent extends BasePageComponent implements OnInit {
  protected checklist_type?: string;
  public checklistForm: FormGroup;

  constructor(
    store: Store<any>,
    route: ActivatedRoute,
    router: Router,
    private fb?: FormBuilder,
    dialog?: MatDialog,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {

    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS, () => {

      if (!this.sail) {
        return;
      }

      if (this.fb) {
        this.updateForm(this.sail);
      }

    });
  }

  public get sail(): Sail {
    return this.getSail(this.sail_id);
  }

  public get sail_id(): string {
    return this.route.snapshot.params.sail_id;
  }

  public get beforeFormControls() {
    return this.checklistForm.controls.before as FormGroup;
  }

  public get afterFormControls() {
    return this.checklistForm.controls.after as FormGroup;
  }

  public get arrivalInstructions(): BoatInstruction[] {
    return this
      .sail
      .boat
      .instructions
      .find(instructions => instructions.instruction_type === BoatInstructionType.Arrival)
      .instructions;
  }

  public get departureInstructions(): BoatInstruction[] {
    return this
      .sail
      .boat
      .instructions
      .find(instructions => instructions.instruction_type === BoatInstructionType.Departure)
      .instructions;
  }

  private updateForm(sail: Sail): void {
    const before = sail.checklists.find(checklist => checklist.checklist_type === SailChecklistType.Before);
    this.checklistForm.controls.before.patchValue(before);

    const after = sail.checklists.find(checklist => checklist.checklist_type === SailChecklistType.After);
    this.checklistForm.controls.after.patchValue(after);

    const formManifest = this.checklistForm.controls.peopleManifest as FormArray;

    formManifest.clear();

    sail.manifest.forEach(sailor => formManifest.push(this.fb.group({
      guest_ofName: this.fb.control(sailor.guest_of?.name),
      person_name: this.fb.control(sailor.person_name),
      sailor_role: this.fb.control(sailor.sailor_role),
      attended: this.fb.control(sailor.attended || false),
      profile: this.fb.control(sailor.profile),
      id: this.fb.control(sailor.id),
    })));

    this.checklistForm.markAsUntouched();
    this.checklistForm.markAsPristine();
  }

  public get formBuilder(): FormBuilder {
    return this.fb;
  }

  protected buildForm(): void {
    let beforeForm = {};
    let afterForm = {};

    if (this.checklist_type === 'before' || this.checklist_type === 'both') {
      beforeForm = {
        before: this.fb.group({
          bilge: new FormControl(BilgeState.DID_NOT_CHECK),
          comments: new FormControl(),
          fire_extinguisher: new FormControl(FireExtinguisherState.DID_NOT_CHECK),
          flares: new FormControl(FlaresState.DID_NOT_CHECK),
          fuel: new FormControl(FuelState.DID_NOT_CHECK),
          id: new FormControl(undefined),
          sail_destination: new FormControl(undefined, Validators.required),
          signed_by_crew: new FormControl(),
          signed_by_skipper: new FormControl(),
          weather: new FormControl(undefined, Validators.required),
        }),
        peopleManifest: this.fb.array([]),
      };
    }

    if (this.checklist_type === 'after' || this.checklist_type === 'both') {
      afterForm = {
        after: this.fb.group({
          bilge: new FormControl(),
          comments: new FormControl(),
          fire_extinguisher: new FormControl(),
          flares: new FormControl(),
          fuel: new FormControl(),
          id: new FormControl(undefined),
          signed_by_crew: new FormControl(),
          signed_by_skipper: new FormControl(),
        }),
      };
    }

    this.checklistForm = this.fb.group({
      ...beforeForm,
      ...afterForm,
    });
  }

  public afterFormErrors(controlName: string): string[] {
    const errors = Object.keys(this.afterFormControls.controls[controlName].errors || {});
    return errors;
  }

  public beforeFormErrors(controlName: string): string[] {
    const errors = Object.keys(this.beforeFormControls.controls[controlName].errors || {});
    return errors;
  }

  public get shouldDisableUpdateButton(): boolean {
    const isFormValid = this.checklistForm.valid;
    const should = !isFormValid
      || !this.checklistForm
      || !this.checklistForm.dirty;

    return !!should;
  }

  public save(): void {
    const formControls = this.checklistForm.controls;
    const formKeys = Object.keys(formControls);
    const changedValue = formKeys
      .filter(key => !formControls[key].pristine)
      .reduce(
        (red, key) => {
          const value = formControls[key].value;

          if (typeof value === 'string') {
            red[key] = value.trim();
          } else {
            red[key] = value ? value : null;
          }

          return red;
        },
        {}
      ) as any;

    this.dispatchAction(updateSailChecklists({ sail_id: this.sail_id, checklistsData: changedValue }));
  }
}
