import {
  Component,
  Input,
} from '@angular/core';
import { Media } from '../../../../../api/src/types/media/media';
import { MediaType } from '../../../../../api/src/types/media/media-type';

@Component({
  selector: 'app-media-display',
  templateUrl: './media-display.component.html',
  styleUrls: ['./media-display.component.scss']
})
export class MediaDisplayComponent {

  public MediaTypes = MediaType;
  @Input() media: Media;

  public get description(): string {
    if (this.media.title && this.media.description) {
      return `${this.media.title} ${this.media.description}`;
    }

    if (this.media.title) {
      return this.media.title;
    }

    if (this.media.description) {
      return this.media.description;
    }

    return '';
  }
}
