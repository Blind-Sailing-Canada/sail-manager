import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-icon-text',
  templateUrl: './icon-text.component.html',
  styleUrls: ['./icon-text.component.scss']
})
export class IconTextComponent {

  @Input() icon: string;
  @Input() text: string;

}
