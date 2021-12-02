import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { Profile } from '../../../../../api/src/types/profile/profile';
import { SailChecklist } from '../../../../../api/src/types/sail-checklist/sail-checklist';
import { SailChecklistType } from '../../../../../api/src/types/sail-checklist/sail-checklist-type';
import { SailorRole } from '../../../../../api/src/types/sail-manifest/sailor-role';
import { Sail } from '../../../../../api/src/types/sail/sail';
import { MomentService } from '../../services/moment.service';

@Component({
  selector: 'app-checklist-summary',
  templateUrl: './checklist-summary.component.html',
  styleUrls: ['./checklist-summary.component.css']
})
export class ChecklistSummaryComponent {

  @Input() sail: Sail;
  @Output() sailViewer: EventEmitter<string> = new EventEmitter();
  @Output() openProfileDialog: EventEmitter<Profile> = new EventEmitter<Profile>();

  public SAILOR_ROLE = SailorRole;

  constructor(
    @Inject(MomentService) private momentService: MomentService,
  ) { }

  public formatDate(date: Date | string): string {
    return this.momentService.format(date);
  }

  public viewSail(): void {
    this.sailViewer.emit(this.sail.id);
  }

  public get sailName(): string {
    return this.sail.name;
  }

  public get beforeDeparture(): SailChecklist {
    return this
      .sail
      .checklists
      .find(checklist => checklist.checklist_type === SailChecklistType.Before);
  }

  public get afterArrival(): SailChecklist {
    return this
      .sail
      .checklists
      .find(checklist => checklist.checklist_type === SailChecklistType.After);
  }

  public get destination(): string {
    return this.beforeDeparture.sail_destination;
  }

  public get weather(): string {
    return this.beforeDeparture.weather;
  }

  public showProfileDialog(profile: Profile): void {
    this.openProfileDialog.emit(profile);
  }
}
