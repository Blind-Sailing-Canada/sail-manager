import {
  Component,
  Input,
} from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-boat-checklist-item-input',
  styleUrls: ['./boat-checklist-item-input.component.scss'],
  templateUrl: './boat-checklist-item-input.component.html',
})
export class BoatChecklistItemInputComponent {
  @Input() public index: number;
  @Input() public inputItemFormGroup: UntypedFormGroup;


  public isRequired(control: string): boolean {
    if (!this.inputItemFormGroup.get(control).validator) {
      return false;
    }

    const validator = this.inputItemFormGroup.get(control).validator({} as AbstractControl);

    if (validator && validator.required) {
      return true;
    }

    return false;
  }
}
