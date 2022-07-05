import { Component, Input, OnChanges } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { BoatChecklist } from '../../../../../api/src/types/boat-checklist/boat-checklist';
import { BoatChecklistItemType } from '../../../../../api/src/types/boat-checklist/boat-checklist-item-type';
import { SelectOption } from '../../models/select-option';

@Component({
  selector: 'app-checklist-form',
  templateUrl: './checklist-form.component.html',
  styleUrls: ['./checklist-form.component.css']
})
export class ChecklistFormComponent implements OnChanges{

  @Input() form: UntypedFormGroup;
  @Input() when: string;
  @Input() boatChecklist: BoatChecklist;

  public BoatChecklistItemType = BoatChecklistItemType;
  public options: Map<string, SelectOption[]> = new Map();

  ngOnChanges(): void {
    this.options = this.boatChecklist.items.reduce((accumulator, item) => {
      if (item.type !== BoatChecklistItemType.Select) {
        return accumulator;
      }

      accumulator[item.key] = this.asSelectOptions(item.options);
      return accumulator;
    }, {}) as Map<string, SelectOption[]>;
  }

  public get checklistForm(): UntypedFormGroup {
    return this.form.controls.checklist as UntypedFormGroup;
  }

  private asSelectOptions(options: string): SelectOption[] {
    return options
      .split(',')
      .map((option) => option.trim())
      .filter(Boolean)
      .map((option) => ({
        label: option,
        value: option
      }));
  }

}
