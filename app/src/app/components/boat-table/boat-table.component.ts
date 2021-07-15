import { Component, Input } from '@angular/core';
import { Boat } from '../../../../../api/src/types/boat/boat';

@Component({
  selector: 'app-boat-table',
  templateUrl: './boat-table.component.html',
  styleUrls: ['./boat-table.component.css']
})
export class BoatTableComponent {

  @Input() boat: Boat;
  @Input() showPictures = true;

}
