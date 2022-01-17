import {
  Component,
  Input,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-text-input',
  styleUrls: ['./form-text-input.component.css'],
  templateUrl: './form-text-input.component.html',
})
export class FormTextInputComponent {
  @Input() public ariaLabel?: string;
  @Input() public controlName: string;
  @Input() public form: FormGroup;
  @Input() public inputType?: string;
  @Input() public label: string;
  @Input() public required: boolean;
}