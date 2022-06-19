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
import { debounceTime, takeWhile } from 'rxjs';
import { BoatInstruction } from '../../../../../../api/src/types/boat-instructions/boat-instruction';
import { BoatInstructionType } from '../../../../../../api/src/types/boat-instructions/boat-instruction-type';
import { SailChecklistType } from '../../../../../../api/src/types/sail-checklist/sail-checklist-type';
import { Sail } from '../../../../../../api/src/types/sail/sail';
import { updateSailChecklists } from '../../../store/actions/sail-checklist.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  template: ''
})
export class SailChecklistBasePageComponent extends BasePageComponent implements OnInit {
  public checklistForm: FormGroup;
  public checklist_type?: SailChecklistType;

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

  public get formBuilder(): FormBuilder {
    return this.fb;
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

  public save(notify: boolean = true): void {
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

    this.dispatchAction(updateSailChecklists({ sail_id: this.sail_id, checklistsData: changedValue, notify }));
  }

  protected buildForm(): void {
    let beforeForm = {};
    let afterForm = {};

    const boatChecklist = (this.sail?.boat?.checklist?.items || [])
      .reduce((accumulator, item) => {
        accumulator[item.key] = this.fb.control(item.defaultValue);
        return accumulator;
      }, {});

    if (this.checklist_type === SailChecklistType.Before || this.checklist_type === SailChecklistType.Both) {
      beforeForm = {
        before: this.fb.group({
          checklist: this.fb.group(boatChecklist),
          comments: new FormControl(),
          id: new FormControl(undefined),
          sail_destination: new FormControl(undefined, Validators.required),
          signed_by_crew: new FormControl(),
          signed_by_skipper: new FormControl(),
          weather: new FormControl(undefined, Validators.required),
        }),
        peopleManifest: this.fb.array([]),
      };
    }

    if (this.checklist_type === SailChecklistType.After || this.checklist_type === SailChecklistType.Both) {
      afterForm = {
        after: this.fb.group({
          checklist: this.fb.group(boatChecklist),
          comments: new FormControl(),
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

    this.checklistForm
      .valueChanges
      .pipe(takeWhile(() => this.active))
      .pipe(debounceTime(2000))
      .subscribe(() => {
        if (this.checklistForm.dirty) {
          this.save(false);
        }
      });

  }

  private updateForm(sail: Sail): void {

    if (this.checklist_type === SailChecklistType.Before || this.checklist_type === SailChecklistType.Both) {
      const boatChecklistBefore = this.fb.group((this.sail?.boat?.checklist?.items || [])
        .reduce((accumulator, item) => {
          accumulator[item.key] = this.fb.control(item.defaultValue);
          return accumulator;
        }, {}));

      (this.checklistForm.controls.before as FormGroup).setControl('checklist', boatChecklistBefore);

      const before = sail.checklists.find(checklist => checklist.checklist_type === SailChecklistType.Before);
      this.checklistForm.controls.before.patchValue(before);
    }

    if (this.checklist_type === SailChecklistType.After || this.checklist_type === SailChecklistType.Both) {
      const boatChecklistAfter = this.fb.group((this.sail?.boat?.checklist?.items || [])
        .reduce((accumulator, item) => {
          accumulator[item.key] = this.fb.control(item.defaultValue);
          return accumulator;
        }, {}));

      (this.checklistForm.controls.after as FormGroup).setControl('checklist', boatChecklistAfter);

      const after = sail.checklists.find(checklist => checklist.checklist_type === SailChecklistType.After);
      this.checklistForm.controls.after.patchValue(after);
    }

    const formManifest = this.checklistForm.controls.peopleManifest as FormArray;

    if (formManifest) {
      formManifest.clear();

      sail.manifest.forEach(sailor => formManifest.push(this.fb.group({
        guest_ofName: this.fb.control(sailor.guest_of?.name),
        person_name: this.fb.control(sailor.person_name),
        sailor_role: this.fb.control(sailor.sailor_role),
        attended: this.fb.control(sailor.attended || false),
        profile: this.fb.control(sailor.profile),
        id: this.fb.control(sailor.id),
      })));
    }

    this.checklistForm.markAsUntouched();
    this.checklistForm.markAsPristine();

  }

}
