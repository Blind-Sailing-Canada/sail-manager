import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { Boat } from '../../../../../api/src/types/boat/boat';
import { Profile } from '../../../../../api/src/types/profile/profile';
import { SailChecklist } from '../../../../../api/src/types/sail-checklist/sail-checklist';
import { SailorRole } from '../../../../../api/src/types/sail-manifest/sailor-role';
import { Sail } from '../../../../../api/src/types/sail/sail';
import { MomentService } from '../../services/moment.service';

@Component({
  selector: 'app-checklist-summary',
  templateUrl: './checklist-summary.component.html',
  styleUrls: ['./checklist-summary.component.scss']
})
export class ChecklistSummaryComponent {

  @Input() sail: Sail;
  @Input() beforeDeparture: SailChecklist;
  @Input() afterArrival: SailChecklist;
  @Output() openBoatDialog: EventEmitter<Boat> = new EventEmitter<Boat>();
  @Output() openProfileDialog: EventEmitter<Profile> = new EventEmitter<Profile>();
  @Output() sailViewer: EventEmitter<string> = new EventEmitter();

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

  public viewBoat(): void {
    if (!this.sail.boat) {
      return;
    }

    this.openBoatDialog.emit(this.sail.boat);
  }

  public get sailName(): string {
    return `${this.sail.name} #${this.sail.entity_number}`;
  }

  public get destination(): string {
    return this.beforeDeparture?.sail_destination;
  }

  public get weather(): string {
    return this.beforeDeparture?.weather;
  }

  public showProfileDialog(profile: Profile): void {
    this.openProfileDialog.emit(profile);
  }
}
