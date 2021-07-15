import {
  Component,
  Input,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css']
})
export class DatePickerComponent {

  @Input() ariaLabel: string;
  @Input() controlName: string;
  @Input() form: FormGroup;
  @Input() id: string;
  @Input() placeholder = '';
  @Input() required: boolean;
  @Input() tooltip: string;

}
