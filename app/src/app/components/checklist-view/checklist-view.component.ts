import { Component, Input } from '@angular/core';
import { SailChecklist } from '../../../../../api/src/types/sail-checklist/sail-checklist';
import { Sail } from '../../../../../api/src/types/sail/sail';

@Component({
  selector: 'app-checklist-view',
  styleUrls: ['./checklist-view.component.css'],
  templateUrl: './checklist-view.component.html',
})
export class ChecklistViewComponent {

  @Input() checklist: SailChecklist;
  @Input() sail: Sail;

  public itemLabel(key: string): string {
    const boatChecklistItem = (this.sail?.boat?.checklist?.items || []).find((item) => item.key === key);

    return boatChecklistItem?.label || key;
  }
}
