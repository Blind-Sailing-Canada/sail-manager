import {
  Component,
  Input,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-boat-checklist-item-select',
  styleUrls: ['./boat-checklist-item-select.component.css'],
  templateUrl: './boat-checklist-item-select.component.html',
})
export class BoatChecklistItemSelectComponent {
  @Input() public selectItemFormGroup: FormGroup;
}
