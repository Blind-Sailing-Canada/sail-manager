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

  public generateSailDiscription(sail: Sail): string {
    const duration = this.duration(sail.start, sail.end);
    const start = this.humanizeDateWithTime(sail.start);
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

  public skipper(sail: Sail): string {
    return sail.manifest.find(sailor => sailor.sailorRole === SailorRole.Skipper)?.profile?.name;
  }

  public crew(sail: Sail): string {
    return sail.manifest.find(sailor => sailor.sailorRole === SailorRole.Crew)?.profile?.name;
  }

  public passengers(sail: Sail): string[] {
    return sail
      .manifest
      .filter(sailor => sailor.sailorRole !== SailorRole.Skipper)
      .filter(sailor => sailor.sailorRole !== SailorRole.Crew)
      .map(sailor => sailor.personName);
  }

}
