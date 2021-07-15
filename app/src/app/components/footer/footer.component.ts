import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  FONT_SIZE,
  FONT_SIZE_MAX,
  FONT_SIZE_MIN,
} from '../../models/font-size';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  public currentFontSize = 4;
  public max = FONT_SIZE_MAX;
  public min = FONT_SIZE_MIN;

  @Input() changingAppFont = false;
  @Output() changeFontSize: EventEmitter<string> = new EventEmitter<string>();

  public decreaseFontSize(): void {
    this.currentFontSize = Math.max(this.min, this.currentFontSize - 1);
    this.changeFontSize.emit(`${FONT_SIZE[this.currentFontSize]}`);
  }

  public increaseFontSize(): void {
    this.currentFontSize = Math.min(this.max, this.currentFontSize + 1);
    this.changeFontSize.emit(`${FONT_SIZE[this.currentFontSize]}`);
  }

}
