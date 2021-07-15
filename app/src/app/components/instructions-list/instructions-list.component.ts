import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { BoatInstruction } from '../../../../../api/src/types/boat-instructions/boat-instruction';

@Component({
  selector: 'app-instructions-list',
  templateUrl: './instructions-list.component.html',
  styleUrls: ['./instructions-list.component.css']
})
export class InstructionsListComponent {

  @Input() title: string;
  @Input() instructions: BoatInstruction[] = [];
  @Input() canReorder: boolean;
  @Output() rearrange: EventEmitter<void> = new EventEmitter<void>();

  public drop(event: CdkDragDrop<string[]>) {
    if (!this.canReorder) {
      return;
    }

    const previousIndex = event.previousIndex;
    const newIndex = event.currentIndex;

    const item = this.instructions.splice(previousIndex, 1)[0];
    this.instructions.splice(newIndex, 0, item);

    this.rearrange.emit();
  }
}
