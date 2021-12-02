import {
  Component,
  Input,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-boat-checklist-item-input',
  styleUrls: ['./boat-checklist-item-input.component.css'],
  templateUrl: './boat-checklist-item-input.component.html',
})
export class BoatChecklistItemInputComponent {

  @Input() public inputItemFormGroup: FormGroup;


}
