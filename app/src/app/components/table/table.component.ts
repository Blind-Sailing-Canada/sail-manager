import {
  Component,
  EventEmitter,
  Input,
  Output
  } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {

  @Input() title: string;
  @Input() id: string;
  @Input() captionActions: { name: string; tooltip: string; icon: string }[] = [];
  @Output() captionAction: EventEmitter<string> = new EventEmitter<string>();

  public captionActionsCallBack(event): void {
    this.captionAction.emit(event);
  }

}
