import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Boat } from '../../../../../api/src/types/boat/boat';

@Component({
  selector: 'app-boat-list',
  styleUrls: ['./boat-list.component.scss'],
  templateUrl: './boat-list.component.html',
})
export class BoatListComponent {

  @Input() public boats: Boat[];
  @Input() public emptyMessage = 'There are no boats.';
  @Input() public isLoading: boolean;
  @Input() public title: string;
  @Output() public clicked: EventEmitter<Boat> = new EventEmitter();
  @Output() public refreshRequest: EventEmitter<void> = new EventEmitter();

  public captionActions = [
    {
      name: 'refresh',
      icon: 'refresh',
      tooltip: 'refresh',
    },
  ];

  constructor(
  ) { }

  public clickBoat(boat: Boat) {
    this.clicked.emit(boat);
  }

  public refresh() {
    this.refreshRequest.emit();
  }

}
