import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import { BoatMaintenance } from '../../../../../api/src/types/boat-maintenance/boat-maintenance';
import { MomentService } from '../../services/moment.service';

@Component({
  selector: 'app-maintenance-list',
  templateUrl: './maintenance-list.component.html',
  styleUrls: ['./maintenance-list.component.scss']
})
export class MaintenanceListComponent {

  @Input() public emptyMessage: string;
  @Input() public isLoading: boolean;
  @Input() public requests: BoatMaintenance[] = [];
  @Input() public title: string;
  @Output() public clicked: EventEmitter<BoatMaintenance> = new EventEmitter();
  @Output() public refreshRequest: EventEmitter<void> = new EventEmitter();

  constructor(
    @Inject(MomentService) private momentService: MomentService
  ) { }

  public generateRequestDescription(request: BoatMaintenance): string {
    const boatName = request.boat.name;
    const requestDate = this.humanizeDateWithTime(request.created_at);
    const requesterName = request.requested_by.name;
    const requestDescription = request.request_details;

    const description = `
    Request details for boat
    ${boatName}, by ${requesterName}, request: ${requestDescription},
    requested on ${requestDate}.
    Click to go to this maintenance request.`;

    return description;
  }

  public clickRequest(request: BoatMaintenance) {
    this.clicked.emit(request);
  }

  public refresh() {
    this.refreshRequest.emit();
  }

  private humanizeDateWithTime(date) {
    return this.momentService.humanizeDateWithTime(date, false);
  }

}
