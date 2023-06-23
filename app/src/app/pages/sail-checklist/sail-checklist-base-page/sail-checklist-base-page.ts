import {
  Component,
  OnInit,
} from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
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
  private autoSave = false;
  public checklist_type?: SailChecklistType;
  public checklistForm: UntypedFormGroup;
  public sail: Sail;

  constructor(
    store: Store<any>,
    route: ActivatedRoute,
    router: Router,
    private fb?: UntypedFormBuilder,
    dialog?: MatDialog,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {

    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS, () => {
      if (!this.sail) {
        this.sail = this.getSail(this.sail_id);
      }

      if (this.sail && this.fb && !this.autoSave) {
        this.sail = this.getSail(this.sail_id);

        this.updateForm(this.sail);
      }
    });

    this.sail = this.getSail(this.sail_id);
  }


  public get sail_id(): string {
    return this.route.snapshot.params.sail_id;
  }

  public get beforeFormControls() {
    return this.checklistForm.controls.before as UntypedFormGroup;
  }

  public get afterFormControls() {
    return this.checklistForm.controls.after as UntypedFormGroup;
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

  public get formBuilder(): UntypedFormBuilder {
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

  public save(notify: boolean = true, autoSave: boolean = false): void {
    this.autoSave = autoSave;

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
          comments: new UntypedFormControl(),
          id: new UntypedFormControl(undefined),
          sail_destination: new UntypedFormControl(undefined, Validators.required),
          signed_by_crew: new UntypedFormControl(),
          signed_by_skipper: new UntypedFormControl(),
          weather: new UntypedFormControl(undefined, Validators.required),
        }),
        peopleManifest: this.fb.array([]),
      };
    }

    if (this.checklist_type === SailChecklistType.After || this.checklist_type === SailChecklistType.Both) {
      afterForm = {
        after: this.fb.group({
          checklist: this.fb.group(boatChecklist),
          comments: new UntypedFormControl(),
          id: new UntypedFormControl(undefined),
          signed_by_crew: new UntypedFormControl(),
          signed_by_skipper: new UntypedFormControl(),
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
      .pipe(debounceTime(1000))
      .subscribe(() => {
        if (this.checklistForm.dirty && this.checklistForm.valid) {
          this.save(false, true);
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

      (this.checklistForm.controls.before as UntypedFormGroup).setControl('checklist', boatChecklistBefore);

      const before = sail.checklists.find(checklist => checklist.checklist_type === SailChecklistType.Before);
      this.checklistForm.controls.before.patchValue(before);
    }

    if (this.checklist_type === SailChecklistType.After || this.checklist_type === SailChecklistType.Both) {
      const boatChecklistAfter = this.fb.group((this.sail?.boat?.checklist?.items || [])
        .reduce((accumulator, item) => {
          accumulator[item.key] = this.fb.control(item.defaultValue);
          return accumulator;
        }, {}));

      (this.checklistForm.controls.after as UntypedFormGroup).setControl('checklist', boatChecklistAfter);

      const after = sail.checklists.find(checklist => checklist.checklist_type === SailChecklistType.After);
      this.checklistForm.controls.after.patchValue(after);
    }

    const formManifest = this.checklistForm.controls.peopleManifest as UntypedFormArray;

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
