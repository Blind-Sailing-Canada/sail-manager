import {
  Component,
  Input,
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-boat-checklist-item-select',
  styleUrls: ['./boat-checklist-item-select.component.css'],
  templateUrl: './boat-checklist-item-select.component.html',
})
export class BoatChecklistItemSelectComponent {
  @Input() public index: number;
  @Input() public selectItemFormGroup: FormGroup;

  public isRequired(control: string): boolean {
    if (!this.selectItemFormGroup.get(control).validator) {
      return false;
    }

    const validator = this.selectItemFormGroup.get(control).validator({} as AbstractControl);

    if (validator && validator.required) {
      return true;
    }

    return false;
  }
}
