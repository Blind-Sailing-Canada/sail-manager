import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BilgeState } from '../../../../../api/src/types/sail-checklist/bilge-state';
import { FireExtinguisherState } from '../../../../../api/src/types/sail-checklist/fire-exstinguisher-state';
import { FlaresState } from '../../../../../api/src/types/sail-checklist/flare-state';
import { FuelState } from '../../../../../api/src/types/sail-checklist/fuel-state';

@Component({
  selector: 'app-checklist-form',
  templateUrl: './checklist-form.component.html',
  styleUrls: ['./checklist-form.component.css']
})
export class ChecklistFormComponent {

  @Input() form: FormGroup;
  @Input() when: string;
  public bilgeState = BilgeState;
  public fire_extinguisherState = FireExtinguisherState;
  public flaresState = FlaresState;
  public fuelLevel = FuelState;

}
