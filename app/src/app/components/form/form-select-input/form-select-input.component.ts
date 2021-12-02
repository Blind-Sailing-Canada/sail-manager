import {
  Component,
  Input,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectOption } from '../../../models/select-option';

@Component({
  selector: 'app-form-select-input',
  styleUrls: ['./form-select-input.component.css'],
  templateUrl: './form-select-input.component.html',
})
export class FormSelectInputComponent {
  @Input() public ariaLabel?: string;
  @Input() public controlName: string;
  @Input() public form: FormGroup;
  @Input() public label: string;
  @Input() public options: SelectOption[];
}
