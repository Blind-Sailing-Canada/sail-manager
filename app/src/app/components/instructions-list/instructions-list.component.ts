import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { BoatInstruction } from '../../../../../api/src/types/boat-instructions/boat-instruction';
import { Media } from '../../../../../api/src/types/media/media';

@Component({
  selector: 'app-instructions-list',
  templateUrl: './instructions-list.component.html',
  styleUrls: ['./instructions-list.component.scss']
})
export class InstructionsListComponent {

  @Input() canReorder: boolean;
  @Input() instructions: BoatInstruction[] = [];
  @Input() title: string;
  @Output() rearrange: EventEmitter<void> = new EventEmitter<void>();
  @Output() showMediaDialog: EventEmitter<Media> = new EventEmitter<Media>();

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
