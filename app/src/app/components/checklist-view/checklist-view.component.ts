import { Component, Input } from '@angular/core';
import { SailChecklist } from '../../../../../api/src/types/sail-checklist/sail-checklist';

@Component({
  selector: 'app-checklist-view',
  styleUrls: ['./checklist-view.component.css'],
  templateUrl: './checklist-view.component.html',
})
export class ChecklistViewComponent {

  @Input() checklist: SailChecklist;

}
