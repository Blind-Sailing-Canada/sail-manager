import {
  Component,
  Input,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent {

  @Input() ariaLabel: string;
  @Input() controlName: string;
  @Input() form: UntypedFormGroup;
  @Input() id: string;
  @Input() placeholder = '';
  @Input() required: boolean;
  @Input() tooltip: string;

}
