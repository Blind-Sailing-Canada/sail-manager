import {
  Component,
  Input,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-time-picker',
  styleUrls: ['./time-picker.component.css'],
  templateUrl: './time-picker.component.html',
})
export class TimePickerComponent {

  @Input() ariaLabel: string;
  @Input() controlName: string;
  @Input() form: FormGroup;
  @Input() id: string;
  @Input() placeholder = '';
  @Input() required: boolean;
  @Input() tooltip: string;

}
