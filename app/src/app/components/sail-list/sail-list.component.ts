import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { SailorRole } from '../../../../../api/src/types/sail-manifest/sailor-role';
import { Sail } from '../../../../../api/src/types/sail/sail';
import { MomentService } from '../../services/moment.service';

@Component({
  selector: 'app-sail-list',
  styleUrls: ['./sail-list.component.css'],
  templateUrl: './sail-list.component.html',
})
export class SailListComponent {

  @Input() public emptyMessage: string;
  @Input() public sails: Sail[] = [];
  @Input() public title: string;
  @Output() public clicked: EventEmitter<Sail> = new EventEmitter();

  constructor(
    @Inject(MomentService) private momentService: MomentService,
  ) { }

  public generateSailDescription(sail: Sail): string {
    const duration = this.duration(sail.start_at, sail.end_at);
    const start = this.humanizeDateWithTime(sail.start_at);
    const name = sail.name;

    const description = `
    Sail details:
    ${name}: ${duration} sail on board of ${sail.boat.name} on ${start}.
    Click to go to this sail.`;

    return description;
  }

  public duration(start: string | Date, finish: string | Date): string {
    return this.momentService.duration(start, finish);
  }

  public humanizeDateWithTime(date) {
    return this.momentService.humanizeDateWithTime(date, false);
  }

  public clickSail(sail: Sail) {
    this.clicked.emit(sail);
  }

  public skipperCount(sail: Sail): number {
    return sail.manifest.filter(sailor => sailor.sailor_role === SailorRole.Skipper).length;
  }

  public crewCount(sail: Sail): number {
    return sail.manifest.filter(sailor => sailor.sailor_role === SailorRole.Crew)?.length;
  }

  public sailorsCount(sail: Sail): number {
    return sail
      .manifest
      .filter(sailor => sailor.sailor_role !== SailorRole.Skipper)
      .filter(sailor => sailor.sailor_role !== SailorRole.Crew)
      .length;
  }

}
