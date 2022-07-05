import {
  Component,
  Input,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-date-time-form',
  styleUrls: ['./date-time-form.component.css'],
  templateUrl: './date-time-form.component.html'
})
export class DateTimeFormComponent {

  @Input() form: UntypedFormGroup;
  @Input() formType: string;
  @Input() id: string;

  public months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
}
